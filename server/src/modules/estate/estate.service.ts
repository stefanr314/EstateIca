import mongoose from "mongoose";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
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
import {
  BaseEstate,
  BaseEstateDocument,
  BusinessEstate,
  ResidentialEstate,
} from "./estate.model";
import {
  GetBusinessEstatesQueryDto,
  GetResidentialEstatesQueryDto,
} from "./dtos/getEstatesQuery.dto";
import { ResidentialType } from "../../shared/types/residentialType.enum";
import { RentalType } from "../../shared/types/rentalType.enum";
import { PersonalEstateFilterDto } from "./dtos/showHiddenFilter.dto";
import { Reservation } from "../reservation/reservation.model";
import { LockDate } from "../reservation/lockDates.model";
import { UserDocument } from "../user/user.model";
import { ImageKitService } from "../../imagekit/imagekit.service";

import bcrypt from "bcrypt";
import { EstateImageService } from "./estateImage.service";
import { Amenities } from "../../shared/types/amenities.enum";
// import multer from 'multer';

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
      guestCount,
      unitsAvailable,
      childrenCount,
      sortBy,
      city,
      country,
      search,
      startDate,
      endDate,
    } = dto;
    const skip = (page - 1) * limit;

    const pipeline: any[] = [];
    const match: any = {};
    if (petAllowed !== undefined) match.petAllowance = petAllowed;
    if (guestCount !== undefined)
      match.guestIncluded = { $gte: guestCount + (childrenCount ?? 0) };
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

    pipeline.push({ $match: match }); //Dodavanje na pipeline match kriterijuma

    if (startDate && endDate) {
      pipeline.push(
        {
          $lookup: {
            from: "reservations",
            localField: "_id",
            foreignField: "estateReserved",
            as: "reservations",
          },
        },
        {
          $lookup: {
            from: "lockdates",
            localField: "_id",
            foreignField: "estate",
            as: "locks",
          },
        },
        {
          $match: {
            reservations: {
              $not: {
                $elemMatch: {
                  startDate: { $lt: endDate },
                  endDate: { $gt: startDate },
                  status: { $nin: ["CANCELLED", "COMPLETED"] },
                },
              },
            },
            locks: {
              $not: {
                $elemMatch: {
                  startDate: { $lt: endDate },
                  endDate: { $gt: startDate },
                },
              },
            },
          },
        }
      );
    }

    pipeline.push({ $project: { reservations: 0, locks: 0 } });

    if (sortBy) {
      const sortObject: Record<string, 1 | -1> = {};
      const sortFields = sortBy.split(",");

      for (const field of sortFields) {
        const [key, order] = field.split(":");
        sortObject[key] = order === "desc" ? -1 : 1; // 1 for ascending, -1 for descending
      }

      pipeline.push({ $sort: sortObject });
    }

    pipeline.push({ $skip: skip }, { $limit: limit });
    const estates = await ResidentialEstate.aggregate(pipeline);

    return estates;
  }

  async getAllBusinessEstates(dto: GetBusinessEstatesQueryDto): Promise<any[]> {
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
      startDate,
      endDate,
    } = dto;
    const skip = (page - 1) * limit;

    const pipeline: any[] = [];
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

    pipeline.push({ $match: match });

    if (endDate && startDate) {
      pipeline.push(
        {
          $lookup: {
            from: "reservations",
            localField: "_id",
            foreignField: "estateReserved",
            as: "reservations",
          },
        },

        {
          $match: {
            reservations: {
              $not: {
                $elemMatch: {
                  startDate: { $lt: endDate },
                  endDate: { $gt: startDate },
                  status: { $nin: ["CANCELLED", "COMPLETED"] },
                },
              },
            },
          },
        }
      );
    }

    pipeline.push({ $project: { reservations: 0 } });
    if (sortBy) {
      const sortObject: Record<string, 1 | -1> = {};
      const sortFields = sortBy.split(",");

      for (const field of sortFields) {
        const [key, order] = field.split(":");
        sortObject[key] = order === "desc" ? -1 : 1; // 1 for ascending, -1 for descending
      }

      pipeline.push({ $sort: sortObject });
    }

    pipeline.push({ $skip: skip }, { $limit: limit });
    const estates = await BusinessEstate.aggregate(pipeline);

    return estates; // Return an array of estate objects
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
    estateType: "residential" | "business",
    images: Express.Multer.File[]
  ): Promise<any> {
    if (estateType === "residential") {
      return this.createResidentialEstate(
        hostId,
        dataDto as CreateResidentialEstateDto,
        images
      );
    } else if (estateType === "business") {
      return this.createBusinessEstate(
        hostId,
        dataDto as CreateBusinessEstateDto,
        images
      );
    } else {
      throw new Error("Unknown estate type");
    }
  }

  private async createResidentialEstate(
    hostId: string,
    data: CreateResidentialEstateDto,
    images: Express.Multer.File[]
  ): Promise<any> {
    const uploadedImages: { url: string; fileId: string }[] = [];

    if (images && images.length > 0) {
      for (const img of images) {
        const result: any = await ImageKitService.uploadFile(
          img.buffer,
          img.originalname
        );
        uploadedImages.push({
          url: result.url,
          fileId: result.fileId,
        }); // U bazi se cuva samo niz url ka pohranjenim slikama na cloud servisu
      }
    }
    const residentialEstateObject = {
      ...data,
      host: hostId,
      images: uploadedImages,
    };
    const res = await ResidentialEstate.create(residentialEstateObject);

    return res;
  }

  private async createBusinessEstate(
    hostId: string,
    data: CreateBusinessEstateDto,
    images: Express.Multer.File[]
  ): Promise<any> {
    const uploadedImages: { url: string; fileId: string }[] = [];

    if (images && images.length > 0) {
      for (const img of images) {
        const result: any = await ImageKitService.uploadFile(
          img.buffer,
          img.originalname
        );
        uploadedImages.push({
          url: result.url,
          fileId: result.fileId,
        }); // U bazi se cuva samo niz url ka pohranjenim slikama na cloud servisu
      }
    }

    const businessEstateObject = {
      ...data,
      host: hostId,
      images: uploadedImages,
    };

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

  async updateEstateAmenities<T extends { findById: Function }>(
    EstateModel: T,
    estateId: string,
    userId: string,
    amenities: Amenities[]
  ) {
    const estate = await EstateModel.findById(estateId);

    if (!estate) {
      throw new NotFoundError("Estate nije pronađen");
    }

    if (estate.host.toString() !== userId) {
      throw new ForbiddenError("Nemate pravo da pristupite ovom resursu");
    }

    (estate as any).amenities = amenities;
    await estate.save();

    return estate;
  }

  async hardDeleteEstate(
    hostId: string,
    estateId: string,
    userPassword: string
  ): Promise<void> {
    const estate = await BaseEstate.findById(estateId).populate<{
      host: UserDocument;
    }>("host");

    if (!estate) {
      throw new NotFoundError("This estate is not found in the base.");
    }
    if (estate.host._id.toString() !== hostId)
      throw new ForbiddenError(
        "Forbidden to perform this action, you are not the owner of estate"
      );
    const { password } = estate.host;

    //Kako bi izveo ovu operaciju korisnik je duzan da posalje validnu lozinku
    const match = await bcrypt.compare(userPassword, password);
    if (!match) throw new UnauthorizedError("Invalid credentials");

    await Reservation.deleteMany({ estateReserved: estateId });

    // // 3. Obriši recenzije
    // await Review.deleteMany({ estateId });

    // // 4. Obriši iz wishlist-a korisnika
    // await User.updateMany(
    //   { wishlist: estateId },
    //   { $pull: { wishlist: estateId } }
    // );

    // 5. Obriši slike sa ImageKit
    if (estate.images && estate.images.length > 0) {
      await EstateImageService.deleteAllEstateImages(
        estate as BaseEstateDocument
      );
    }

    await BaseEstate.deleteOne({ _id: estateId });
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
