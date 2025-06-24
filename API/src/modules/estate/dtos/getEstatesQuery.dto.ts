import z from "zod/v4";
import { ResidentialType } from "../../../shared/types/residentialType.enum";
import { RoomType } from "../../../shared/types/roomType.enum";
import { Amenities } from "../../../shared/types/amenities.enum";
import { CancellationPolicy } from "../../../shared/types/cancellationPolicy.enum";
import { RentalType } from "../../../shared/types/rentalType.enum";

export const getResidentialEstatesQueryDto = z.object({
  page: z.coerce.number().positive().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),

  // Filters (svi su optional)
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minBeds: z.coerce.number().min(0).optional(),
  maxBeds: z.coerce.number().min(0).optional(),
  rentalType: z.enum(RentalType).optional(),
  residentialType: z.enum(ResidentialType).optional(),
  roomType: z.enum(RoomType).optional(),
  cancellationPolicy: z.enum(CancellationPolicy).optional(),
  amenities: z.array(z.enum(Amenities)).optional(),
  petAllowed: z.stringbool().optional(),
  guestsIncluded: z.coerce.number().positive().optional(),
  unitsAvailable: z.coerce.number().positive().optional(),

  // Sorting: 'price' or '-createdAt'
  sortBy: z.string().optional(),

  // Search by city / text
  city: z.string().optional(),
  country: z.string().optional(),
  search: z.string().optional(),
});

export const getBusinessEstatesQueryDto = z.object({
  page: z.coerce.number().positive().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),

  // Filters (svi su optional)
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minArea: z.coerce.number().positive().optional(),
  maxArea: z.coerce.number().positive().optional(),
  floor: z.coerce.number().optional(),
  hasElevator: z.stringbool().optional(),
  hasRestroom: z.stringbool().optional(),
  hasParking: z.stringbool().optional(),
  internetReady: z.stringbool().optional(),
  ceilingHeight: z.coerce.number().positive().optional(),
  leaseMonths: z.coerce.number().positive().optional(),
  parkingSpaces: z.coerce.number().positive().optional(),
  intentedUse: z
    .enum(["retail", "office", "warehouse", "hospitality", "other"])
    .optional(),
  cancellationPolicy: z.enum(CancellationPolicy).optional(),
  amenities: z.array(z.enum(Amenities)).optional(),
  unitsAvailable: z.coerce.number().positive().optional(),

  // Sorting: 'price' or '-createdAt'
  sortBy: z.string().optional(),

  // Search by city / text
  city: z.string().optional(),
  country: z.string().optional(),
  search: z.string().optional(),
});

export type GetResidentialEstatesQueryDto = z.infer<
  typeof getResidentialEstatesQueryDto
>;

export type GetBusinessEstatesQueryDto = z.infer<
  typeof getBusinessEstatesQueryDto
>;
