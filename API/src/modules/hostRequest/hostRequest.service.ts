import { HydratedDocument } from "mongoose";
import { ConflictError, NotFoundError } from "../../shared/errors";
import { HostRequestStatus } from "../../shared/types/hostRequest.enum";
import { Role } from "../../shared/types/role.enum";
import { IUser, User } from "../user/user.model";
import { CreateHostRequestDto } from "./dtos/createHostRequest.dto";
import { HostRequest, IHostRequest } from "./hostRequest.model";
import { HostRequestIdParamsDto } from "./dtos/hostRequestIdParams.dto";
import { UpdateHostRequestStatusDto } from "./dtos/updateHostRequestStatus.dto";
import { sendEmail } from "../../shared/utils/sendMail";
import { GetAllHostRequestsDto } from "./dtos/getAllHostRequests.dto";

export class HostRequestService {
  // Add methods for handling host requests here
  // For example:
  // - createHostRequest -- this method is already implemented
  // - getHostRequestById -- this method is already implemented
  // - updateHostRequestStatus -- this method is already implemented
  // - getHostRequestsByUserId
  // - deleteHostRequest -- this method is already implemented
  // - listHostRequests
  async getHostRequestById(
    dto: HostRequestIdParamsDto
  ): Promise<HydratedDocument<IHostRequest>> {
    const hostRequest = await HostRequest.findById(dto.requestId);
    if (!hostRequest) {
      throw new NotFoundError("Host request not found.");
    }
    return hostRequest;
  }

  async getAllHostRequests(dto: GetAllHostRequestsDto): Promise<any[]> {
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
        },
      },
      { $unwind: "$user" },
    ];

    // SEARCH
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { "user.firstName": { $regex: search, $options: "i" } },
            { "user.lastName": { $regex: search, $options: "i" } },
            { "user.email": { $regex: search, $options: "i" } },
          ],
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

    // PAGINATION
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const result = await HostRequest.aggregate(pipeline);
    return result;
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
      user: HydratedDocument<IUser>;
    }>("user");

    if (!hostRequest) {
      throw new NotFoundError("Host request not found.");
    }

    if (
      hostRequest.status === HostRequestStatus.APPROVED ||
      hostRequest.status === HostRequestStatus.REJECTED
    ) {
      throw new ConflictError("Host request has already been reviewed.");
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
