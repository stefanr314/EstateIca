import { z } from "zod/v4";
import {
  createResidentialEstateDto,
  createBusinessEstateDto,
} from "./createEstate.dto";
import { Amenities } from "../../../shared/types/amenities.enum";
import { CancellationPolicy } from "../../../shared/types/cancellationPolicy.enum";
import { ResidentialType } from "../../../shared/types/residentialType.enum";
import { RoomType } from "../../../shared/types/roomType.enum";

export const updateResidentialEstateDto = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(1).optional(),
  neighborhoodOverview: z.string().optional(),
  notes: z.string().optional(),
  houseRules: z.string().optional(),
  transit: z.string().optional(),
  access: z.string().optional(),
  cancellationPolicy: z.enum(CancellationPolicy).optional(),
  securityDeposit: z.number().nonnegative().optional(),

  bedrooms: z.number().int().positive().optional(),
  bathrooms: z.number().int().positive().optional(),
  beds: z.number().int().positive().optional(),
  minimumStay: z.number().int().positive().optional(),
  maximumStay: z.number().int().positive().optional(),
  pricePerNight: z.number().positive().optional(),
  pricePerMonth: z.number().positive().optional(),
  area: z.number().positive().optional(),
  residentialType: z.enum(ResidentialType).optional(),
  roomType: z.enum(RoomType).optional(),
  guestIncluded: z.number().int().nonnegative().optional(),
  extraPeople: z.number().int().nonnegative().optional(),
  petAllowance: z.boolean().optional(),
  unitsAvailable: z.number().int().positive().optional(),
  amenities: z.array(z.enum(Amenities)).optional(),
});

export const updateBusinessEstateDto = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(1).optional(),
  pricePerMonth: z.number().positive().optional(),
  area: z.number().positive().optional(),
  unitsAvailable: z.number().int().positive().optional(),

  // specifična polja za business estate
  intentedUse: z
    .enum(["retail", "office", "warehouse", "hospitality", "other"])
    .optional(),
  floor: z.number().int().optional(),
  hasElevator: z.boolean().optional(),
  isGroundFloor: z.boolean().optional(),
  ceilingHeight: z.number().positive().optional(),
  hasParking: z.boolean().optional(),
  parkingSpaces: z.number().int().positive().optional(),
  hasRestroom: z.boolean().optional(),
  minimumLeaseMonths: z.number().int().positive().optional(),
  maximumLeaseMonths: z.number().int().positive().optional(),
  airConditioning: z.boolean().optional(),
  internetReady: z.boolean().optional(),
  amenities: z.array(z.enum(Amenities)).optional(),
});

export const updateBusinessEstateFeaturesDto = z.object({
  hasElevator: z.boolean().optional(),
  isGroundFloor: z.boolean().optional(),
  ceilingHeight: z.number().positive().optional(),
  hasParking: z.boolean().optional(),
  parkingSpaces: z.number().int().positive().optional(),
  hasRestroom: z.boolean().optional(),
  airConditioning: z.boolean().optional(),
  internetReady: z.boolean().optional(),
});

export const updateEstateAmenitiesDto = z.object({
  amenities: z.array(z.enum(Amenities)),
});

export type UpdateResidentialEstateDto = z.infer<
  typeof updateResidentialEstateDto
>;

export type UpdateBusinessEstateDto = z.infer<typeof updateBusinessEstateDto>;
export type UpdateEstateAmenitiesDto = z.infer<typeof updateEstateAmenitiesDto>;
export type UpdateBusinessEstateFeaturesDto = z.infer<
  typeof updateBusinessEstateFeaturesDto
>;
