import mongoose from "mongoose";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../shared/errors";
import {
  CreateBusinessEstateDto,
  CreateResidentialEstateDto,
} from "./dtos/createEstate.dto";
import {
  updateBusinessEstateDto,
  UpdateBusinessEstateDto,
  updateResidentialEstateDto,
  UpdateResidentialEstateDto,
} from "./dtos/updateEstate.dto";
import { BaseEstate, BusinessEstate, ResidentialEstate } from "./estate.model";
import {
  GetBusinessEstatesQueryDto,
  GetResidentialEstatesQueryDto,
} from "./dtos/getEstatesQuery.dto";
import { ResidentialType } from "../../shared/types/residentialType.enum";
import { RentalType } from "../../shared/types/rentalType.enum";
import { PersonalEstateFilterDto } from "./dtos/showHiddenFilter.dto";

export class EstateService {
  // Add methods for estate management here
  // For example, createEstate, getEstateById, updateEstate, deleteEstate, etc.
  // Each method should interact with the database and handle business logic

  async getEstateById(estateId: string, hostId?: string): Promise<any> {
    const estate = await BaseEstate.findById(estateId).populate(
      "host",
      "firstName lastName email"
    );
    logging.info(hostId);

    if (!estate) throw new NotFoundError("Estate not found.");

    const estateHostId =
      estate.host instanceof mongoose.Types.ObjectId
        ? estate.host.toString()
        : estate.host?._id?.toString();

    const isOwner = hostId && estateHostId === hostId;

    if (estate.hidden && !isOwner) {
      throw new ForbiddenError("This estate is not publicly available.");
    }

    return estate; // Return the estate object
  }

  async getAllResidentialEstates(
    dto: GetResidentialEstatesQueryDto
  ): Promise<any[]> {
    // Logic to retrieve all estates
    // Fetch from database, handle pagination, etc.
    const {
      page,
      limit,
      minPrice,
      maxPrice,
      minBeds,
      maxBeds,
      rentalType,
      residentialType,
      roomType,
      cancellationPolicy,
      amenities,
      petAllowed,
      guestsIncluded,
      unitsAvailable,
      sortBy,
      city,
      country,
      search,
    } = dto;
    const skip = (page - 1) * limit;

    const match: any = {};
    if (petAllowed !== undefined) match.petAllowance = petAllowed;
    if (guestsIncluded !== undefined) match.guestIncluded = guestsIncluded;
    if (rentalType !== undefined) match.rentalType = rentalType;
    if (residentialType !== undefined) match.residentialType = residentialType;
    if (roomType !== undefined && residentialType === ResidentialType.ROOM)
      match.roomType = roomType;
    if (cancellationPolicy !== undefined)
      match.cancellationPolicy = cancellationPolicy;
    if (rentalType === RentalType.LONG_TERM && unitsAvailable)
      match.unitsAvailable = unitsAvailable;
    if (amenities && amenities.length > 0) {
      match.amenities = { $all: amenities };
    }
    if (city) match["address.city"] = { $regex: city, $options: "i" };
    if (country) match["address.country"] = { $regex: country, $options: "i" };
    if (search) match.title = { $regex: search, $options: "i" };

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceQuery: any = {};
      if (minPrice !== undefined) priceQuery.$gte = minPrice;
      if (maxPrice !== undefined) priceQuery.$lte = maxPrice;

      if (rentalType === RentalType.SHORT_TERM) {
        match.pricePerNight = priceQuery;
      } else if (rentalType === RentalType.LONG_TERM) {
        match.pricePerMonth = priceQuery;
      } else {
        match.$or = [
          { pricePerNight: priceQuery },
          { pricePerMonth: priceQuery },
        ];
      }
    }

    if (minBeds !== undefined || maxBeds !== undefined) {
      match.beds = {
        ...(minBeds !== undefined && { $gte: minBeds }),
        ...(maxBeds !== undefined && { $lte: maxBeds }),
      };
    }

    match.hidden = false; // Ensure hidden estates are not included in the results

    const query = ResidentialEstate.find(match);
    if (sortBy) {
      const sortObject: Record<string, 1 | -1> = {};
      const sortFields = sortBy.split(",");

      for (const field of sortFields) {
        const [key, order] = field.split(":");
        sortObject[key] = order === "desc" ? -1 : 1; // 1 for ascending, -1 for descending
      }
      query.sort(sortObject);
    }

    const result = await query.skip(skip).limit(limit);
    // if (!result || result.length === 0)
    //   throw new NotFoundError("No estates matches the criteria");

    return result; // Return an array of estate objects
  }
  async getAllBusinessEstates(dto: GetBusinessEstatesQueryDto): Promise<any[]> {
    // Logic to retrieve all estates
    // Fetch from database, handle pagination, etc.
    const {
      page,
      limit,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      floor,
      hasElevator,
      hasParking,
      hasRestroom,
      internetReady,
      ceilingHeight,
      cancellationPolicy,
      leaseMonths,
      parkingSpaces,
      intentedUse,
      amenities,
      unitsAvailable,
      sortBy,
      city,
      country,
      search,
    } = dto;
    const skip = (page - 1) * limit;

    const match: any = {};
    if (floor !== undefined) match.floor = floor;
    if (minPrice !== undefined || maxPrice !== undefined) {
      if (minPrice !== undefined) match.pricePerMonth = { $gte: minPrice };
      if (maxPrice !== undefined) match.pricePerMonth = { $lte: maxPrice };
    }
    if (minArea !== undefined || maxArea !== undefined) {
      match.area = {
        ...(minArea !== undefined && { $gte: minArea }),
        ...(maxArea !== undefined && { $lte: maxArea }),
      };
    }
    if (hasElevator !== undefined) match.hasElevator = hasElevator;
    if (hasParking !== undefined) match.hasParking = hasParking;
    if (hasRestroom !== undefined) match.hasRestroom = hasRestroom;
    if (internetReady !== undefined) match.internetReady = internetReady;
    if (ceilingHeight !== undefined)
      match.ceilingHeight = { $gte: ceilingHeight };
    if (cancellationPolicy !== undefined)
      match.cancellationPolicy = cancellationPolicy;
    if (leaseMonths !== undefined) {
      match.minimumLeaseMonths = { $lte: leaseMonths };
      match.maximumLeaseMonths = { $gte: leaseMonths };
    }
    if (parkingSpaces !== undefined)
      match.parkingSpaces = { $gte: parkingSpaces };
    if (intentedUse !== undefined) match.intentedUse = intentedUse;
    if (unitsAvailable !== undefined) match.unitsAvailable = unitsAvailable;
    if (amenities && amenities.length > 0) {
      match.amenities = { $all: amenities };
    }
    if (city) match["address.city"] = { $regex: city, $options: "i" };
    if (country) match["address.country"] = { $regex: country, $options: "i" };
    if (search) match.title = { $regex: search, $options: "i" };

    match.hidden = false; // Ensure hidden estates are not included in the results

    const query = BusinessEstate.find(match);
    if (sortBy) {
      const sortObject: Record<string, 1 | -1> = {};
      const sortFields = sortBy.split(",");

      for (const field of sortFields) {
        const [key, order] = field.split(":");
        sortObject[key] = order === "desc" ? -1 : 1; // 1 for ascending, -1 for descending
      }
      query.sort(sortObject);
    }

    const result = await query.skip(skip).limit(limit);
    return result; // Return an array of estate objects
  }

  async getAllHostEstates(hostId: string, filterDto: PersonalEstateFilterDto) {
    const { page, limit, showHidden, rentalType, estateType, sortBy } =
      filterDto;
    const skip = (page - 1) * limit;
    const match: any = {};

    if (showHidden !== undefined) match.hidden = showHidden;
    if (estateType !== undefined) match.estateType = estateType;
    if (rentalType !== undefined) match.rentalType = rentalType;
    match.host = hostId;
    const query = BaseEstate.find(match);

    logging.info(match);
    if (sortBy) {
      const sortObject: Record<string, 1 | -1> = {};
      const sortFields = sortBy.split(",");

      for (const field of sortFields) {
        const [key, order] = field.split(":");
        sortObject[key] = order === "desc" ? -1 : 1; // 1 for ascending, -1 for descending
      }
      query.sort(sortObject);
    }
    // logging.log(query);
    const estates = await query.skip(skip).limit(limit);
    return estates;
  }

  async createEstate(
    dataDto: CreateBusinessEstateDto | CreateResidentialEstateDto,
    hostId: string,
    estateType: "residential" | "business"
  ): Promise<any> {
    if (estateType === "residential") {
      return this.createResidentialEstate(
        dataDto as CreateResidentialEstateDto,
        hostId
      );
    } else if (estateType === "business") {
      return this.createBusinessEstate(
        dataDto as CreateBusinessEstateDto,
        hostId
      );
    } else {
      throw new Error("Unknown estate type");
    }
  }

  private async createResidentialEstate(
    data: CreateResidentialEstateDto,
    hostId: string
  ): Promise<any> {
    const residentialEstateObject = { ...data, host: hostId };
    logging.info(residentialEstateObject);
    const res = await ResidentialEstate.create(residentialEstateObject);

    return res;
  }

  private async createBusinessEstate(
    data: CreateBusinessEstateDto,
    hostId: string
  ): Promise<any> {
    const businessEstateObject = { ...data, host: hostId };
    const res = await BusinessEstate.create(businessEstateObject);

    return res;
  }

  async updateEstate(
    estateId: string,
    estateData: UpdateBusinessEstateDto | UpdateResidentialEstateDto,
    hostId: string
  ): Promise<any> {
    if (!Object.keys(estateData).length) return;

    const estate = await BaseEstate.findById(estateId);

    if (!estate) throw new NotFoundError("Estate not found");
    if (estate.host.toString() !== hostId)
      throw new ForbiddenError(
        "Forbidden to perform this action, you are not the owner of estate"
      );

    const updateData =
      estate.estateType === "ResidentialEstate"
        ? (estateData as UpdateResidentialEstateDto)
        : (estateData as UpdateBusinessEstateDto);

    // Validation done here due to check() property on dtos which has to be merged with existing data in document
    const merged = { ...estate.toObject(), ...updateData };
    const result =
      estate.estateType === "ResidentialEstate"
        ? updateResidentialEstateDto.safeParse(merged)
        : updateBusinessEstateDto.safeParse(merged);

    if (!result.success) throw new BadRequestError("Validation failed");

    Object.assign(estate, updateData);
    await estate.save();

    return estate; // Return the updated estate object
  }

  async deleteEstate(estateId: string): Promise<void> {
    // Logic to delete an estate
    // Remove from database, handle errors, etc.
  }

  async toggleEstateVisibility(
    estateId: string,
    hostId: string,
    isAdmin: boolean
  ): Promise<any> {
    const estate = await BaseEstate.findById(estateId);

    if (!estate) throw new NotFoundError("Estate not found");
    if (estate.host.toString() !== hostId && !isAdmin)
      throw new ForbiddenError(
        "Forbidden to perform this action, you are not the owner of estate"
      );

    estate.hidden = !estate.hidden; // Toggle hidden status
    await estate.save();
    return estate; // Return the updated estate object
  }

  async getEstatesByRating(minRating: number): Promise<any[]> {
    // Logic to retrieve estates by minimum rating
    // Fetch from database, handle errors, etc.
    return []; // Return an array of estate objects with a rating greater than or equal to minRating
  }
  async getEstatesByAvailability(
    startDate: Date,
    endDate: Date
  ): Promise<any[]> {
    // Logic to retrieve estates available within a date range
    // Implement availability checks, handle errors, etc.
    return []; // Return an array of estate objects available in the specified date range
  }
}
