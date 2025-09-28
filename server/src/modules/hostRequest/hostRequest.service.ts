import { HydratedDocument } from "mongoose";
import { ConflictError, NotFoundError } from "../../shared/errors";
import { HostRequestStatus } from "../../shared/types/hostRequest.enum";
import { Role } from "../../shared/types/role.enum";
import { IUser, User, UserDocument } from "../user/user.model";
import { CreateHostRequestDto } from "./dtos/createHostRequest.dto";
import { HostRequest, IHostRequest } from "./hostRequest.model";
import { HostRequestIdParamsDto } from "./dtos/hostRequestIdParams.dto";
import { UpdateHostRequestStatusDto } from "./dtos/updateHostRequestStatus.dto";
import { sendEmail } from "../../shared/utils/sendMail";
import { GetAllHostRequestsDto } from "./dtos/getAllHostRequests.dto";

export class HostRequestService {
  async getHostRequestById(dto: HostRequestIdParamsDto) {
    const hostRequest = await HostRequest.findById(dto.requestId)
      .populate<{
        user: UserDocument;
      }>(
        "user",
        "firstName lastName email phoneNumber isVerified isActive profilePictureUrl"
      )
      .lean();

    if (!hostRequest) {
      throw new NotFoundError("Host request not found.");
    }

    const { profilePictureUrl, ...restUser } = hostRequest.user;
    return {
      ...hostRequest,
      user: {
        ...restUser,
        profilePicture: profilePictureUrl,
      },
    };
  }

  async getMyHostRequest(userId: string) {
    const hostRequest = await HostRequest.findOne({
      user: userId,
    }).lean();

    if (!hostRequest) {
      throw new NotFoundError("Zahtjev nije pronadjen.");
    }

    return hostRequest;
  }

  async getAllHostRequests(dto: GetAllHostRequestsDto) {
    const { page, limit, status, archived, requestedType, search, sortBy } =
      dto;
    const skip = (page - 1) * limit;
    const match: any = {};

    if (status) match.status = status;
    if (archived !== undefined) match.archived = archived;
    if (requestedType) match.requestedType = requestedType;

    const pipeline: any[] = [
      { $match: match },

      // JOIN user
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: {
                id: "$_id",
                email: 1,
                _id: 0,
              },
            },
          ],
        },
      },
      { $unwind: "$user" },
    ];

    // SEARCH
    if (search) {
      pipeline.push({
        $match: {
          $or: [{ "user.email": { $regex: search, $options: "i" } }],
        },
      });
    }

    // SORT
    if (sortBy) {
      const sortObject: Record<string, 1 | -1> = {};
      const sortFields = sortBy.split(",");

      for (const field of sortFields) {
        const [key, order] = field.split(":");
        sortObject[key] = order === "desc" ? -1 : 1;
      }

      pipeline.push({ $sort: sortObject });
    }
    // === FACET za count + data ===
    pipeline.push({
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: "count" }],
      },
    });

    const result = await HostRequest.aggregate(pipeline);

    // transformacija izlaza
    return {
      data: result[0].data,
      totalCount: result[0].totalCount[0]?.count || 0,
      page,
      limit,
    };
  }

  async createHostRequest(
    userId: string,
    dto: CreateHostRequestDto
  ): Promise<HydratedDocument<IHostRequest>> {
    // Validate the userId and dto before proceeding
    const existing = await HostRequest.findOne({ user: userId });
    if (existing) {
      throw new ConflictError("User already has a host request.");
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found.");
    }
    if (user.role === Role.HOST) {
      throw new ConflictError("User is already a host.");
    }
    const hostRequestObject = {
      user: userId,
      status: HostRequestStatus.PENDING,
      archived: false,
      ...dto,
    };
    const hostRequest = new HostRequest(hostRequestObject);
    await hostRequest.save();
    return hostRequest;
  }

  async updateHostRequestStatus(
    dto: HostRequestIdParamsDto,
    updateData: UpdateHostRequestStatusDto
  ): Promise<HydratedDocument<IHostRequest>> {
    const hostRequest = await HostRequest.findById(dto.requestId).populate<{
      user: UserDocument;
    }>("user");

    if (!hostRequest) {
      throw new NotFoundError("Zahtjev nije pronadjen.");
    }

    if (
      hostRequest.status === HostRequestStatus.APPROVED ||
      hostRequest.status === HostRequestStatus.REJECTED
    ) {
      throw new ConflictError(
        "Zahtjev za postojanjem domacina je vec pregledan."
      );
    }

    hostRequest.status = updateData.status;
    hostRequest.adminComment = updateData.adminComment;
    hostRequest.archived = true; // Archive the request after processing

    await hostRequest.save();

    if (hostRequest.status === HostRequestStatus.APPROVED) {
      // Update the user's role to HOST if the request is approved
      if (hostRequest.user.role !== Role.HOST) {
        hostRequest.user.role = Role.HOST;
        hostRequest.user.hostType = hostRequest.requestedType;
        await hostRequest.user.save();
      }
    }

    // Send email notification to the user about the status update
    const info = await sendEmail({
      to: hostRequest.user.email,
      subject: "Host Request Status Updated",
      templateName: "hostRequestStatus",
      placeholders: {
        userName: hostRequest.user.firstName,
        status: hostRequest.status,
        adminComment: hostRequest.adminComment ?? "",
      },
    });
    if (!info) {
      logging.error("Failed to send email notification.");
    }

    return hostRequest;
  }

  async deleteHostRequest(
    dto: HostRequestIdParamsDto
  ): Promise<{ message: string; id: string }> {
    const hostRequest = await HostRequest.findById(dto.requestId);
    if (!hostRequest) {
      throw new NotFoundError("Host request not found.");
    }
    hostRequest.archived = true; // Mark as archived instead of deleting - Soft delete
    await hostRequest.save();
    return {
      message: "Host request archived successfully.",
      id: hostRequest._id.toString(),
    };
  }
}
