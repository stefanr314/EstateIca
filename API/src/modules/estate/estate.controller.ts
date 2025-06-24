import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../../shared/errors";
import {
  CreateBusinessEstateDto,
  CreateResidentialEstateDto,
} from "./dtos/createEstate.dto";
import { EstateService } from "./estate.service";
import { EstateIdParams } from "./dtos/estateIdParams";
import {
  UpdateBusinessEstateDto,
  UpdateResidentialEstateDto,
} from "./dtos/updateEstate.dto";
import {
  GetBusinessEstatesQueryDto,
  GetResidentialEstatesQueryDto,
} from "./dtos/getEstatesQuery.dto";
import { PersonalEstateFilterDto } from "./dtos/showHiddenFilter.dto";

const estateService = new EstateService();

export const getEstateById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hostId = req.user?.id;
    const { estateId } = req.params as EstateIdParams;
    const result = await estateService.getEstateById(estateId, hostId);

    res
      .status(200)
      .json({ message: "Estate retrieved successfully", estate: result });
  } catch (error) {
    next(error);
  }
};

export const getAllResidentialEstates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const dto = req.validated?.query as unknown as GetResidentialEstatesQueryDto;

  const result = await estateService.getAllResidentialEstates(dto);

  res.status(200).json({
    message: "Estates retrieved successfully.",
    estates: result,
    count: result.length,
  });
};

export const getAllBusinessEstates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const dto = req.validated?.query as unknown as GetBusinessEstatesQueryDto;
  const result = await estateService.getAllBusinessEstates(dto);

  res.status(200).json({
    message:
      result.length === 0
        ? "No estates match the criteria"
        : "Estate retrieved successfully",
    estates: result,
    count: result.length,
  });
};

export const getAllPersonalEstates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user)
    throw new UnauthorizedError("You must be logged in to perform this action");

  const hostId = req.user.id;
  const dto = req.validated?.query as unknown as PersonalEstateFilterDto;

  const result = await estateService.getAllHostEstates(hostId, dto);

  res.status(200).json({
    message:
      result.length === 0
        ? "You haven't created any estates yet or no estates match the criteria"
        : "Personal estates retrieved successfully",
    personalEstate: result,
  });
};

export const createEstate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Logic for creating a residential estate
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated");
    }
    if (req.user?.role !== "host") {
      throw new ForbiddenError("Only hosts can create estates");
    }
    if (
      req.estateTypeCreated !== "residential" &&
      req.estateTypeCreated !== "business"
    ) {
      throw new ForbiddenError("Invalid or missing estate type");
    }

    const hostId = req.user.id;
    const estateData =
      req.estateTypeCreated === "residential"
        ? (req.body as CreateResidentialEstateDto)
        : (req.body as CreateBusinessEstateDto);

    const result = await estateService.createEstate(
      estateData,
      hostId,
      req.estateTypeCreated
    );

    res
      .status(201)
      .json({ message: "Estate created successfully", estate: result });
  } catch (error) {
    next(error);
  }
};

export const updateEstate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError("User not authenticated");
    }
    if (req.user?.role !== "host") {
      throw new ForbiddenError("Only hosts can update estates");
    }
    const hostId = req.user.id;
    const { estateId } = req.params as EstateIdParams;
    const updateDataDto = req.body as
      | UpdateBusinessEstateDto
      | UpdateResidentialEstateDto;

    const result = await estateService.updateEstate(
      estateId,
      updateDataDto,
      hostId
    );

    res
      .status(200)
      .json({ message: "Estate updated successfully", estate: result });
  } catch (error) {
    next(error);
  }
};

export const toggleEstateVisibility = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { estateId } = req.params as EstateIdParams;
  const hostId = req.user?.id;
  if (!hostId) {
    throw new UnauthorizedError("You must be logged in to perform this action");
  }
  if (req.user?.role !== "host" && req.user?.role !== "admin") {
    throw new ForbiddenError(
      "Only hosts and admins can toggle estate visibility"
    );
  }
  const isAdmin = req.user?.role === "admin";
  const result = await estateService.toggleEstateVisibility(
    estateId,
    hostId,
    isAdmin
  );
  res.status(200).json({
    message: "Estate visibility toggled successfully",
    estate: result,
  });
};
