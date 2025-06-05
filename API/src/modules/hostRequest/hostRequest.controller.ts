import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../../shared/errors";
import { CreateHostRequestDto } from "./dtos/createHostRequest.dto";
import { HostRequestService } from "./hostRequest.service";
import { HostRequestIdParamsDto } from "./dtos/hostRequestIdParams.dto";
import { UpdateHostRequestStatusDto } from "./dtos/updateHostRequestStatus.dto";
import { GetAllHostRequestsDto } from "./dtos/getAllHostRequests.dto";

const hostRequestService = new HostRequestService();

export const createHostRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated.");
    }
    const userId = req.user.id;
    const dto: CreateHostRequestDto = req.body;
    const hostRequest = await hostRequestService.createHostRequest(userId, dto);
    res.status(201).json({
      message: "Host request created successfully.",
      id: hostRequest._id.toString(),
      status: hostRequest.status,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllHostRequests = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dto = req.validated?.query as unknown as GetAllHostRequestsDto; // Cast to GetAllHostRequestsDto
    const hostRequests = await hostRequestService.getAllHostRequests(dto);
    res.status(200).json({
      message: "Host requests retrieved successfully.",
      hostRequests,
    });
  } catch (error) {
    next(error);
  }
};

export const getHostRequestById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dto = req.params as HostRequestIdParamsDto;
    const hostRequest = await hostRequestService.getHostRequestById(dto);
    if (
      req.user &&
      req.user.role !== "admin" &&
      req.user.id !== hostRequest.user.toString()
    ) {
      throw new ForbiddenError("User not authorized to view this request.");
    }
    res.status(200).json({
      message: "Host request retrieved successfully.",
      hostRequest,
    });
  } catch (error) {
    next(error);
  }
};

export const updateHostRequestStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated.");
    }
    const dto = req.params as HostRequestIdParamsDto;
    const updateData = req.body as UpdateHostRequestStatusDto;

    // Ensure the user is authorized to update the request
    if (req.user.role !== "admin") {
      throw new UnauthorizedError(
        "User not authorized to update this request."
      );
    }

    const updatedHostRequest = await hostRequestService.updateHostRequestStatus(
      dto,
      updateData
    );

    res.status(200).json({
      message: "Host request status updated successfully.",
      hostRequest: updatedHostRequest,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHostRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const dto = req.params as HostRequestIdParamsDto;
    const result = await hostRequestService.deleteHostRequest(dto);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
