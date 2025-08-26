import { z } from "zod/v4";
import { CancellationPolicy } from "../../../shared/types/cancellationPolicy.enum";
import { RentalType } from "../../../shared/types/rentalType.enum";
import { Amenities } from "../../../shared/types/amenities.enum";
import { ResidentialType } from "../../../shared/types/residentialType.enum";
import { RoomType } from "../../../shared/types/roomType.enum";

export const addressSchema = z.object({
  country: z.string(),
  city: z.string(),
  postalCode: z.string().optional(),
  street: z.string(),
  suburb: z.string().optional(),
  countryCode: z.string(),
  location: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([
      z.number().min(-180).max(180),
      z.number().min(-90).max(90),
    ]), // [lng, lat]
  }),
});

export const baseEstateDto = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(1),
  hidden: z.boolean().default(false),
  neighborhoodOverview: z.string().optional(),
  notes: z.string().optional(),
  houseRules: z.string().optional(),
  transit: z.string().optional(),
  access: z.string().optional(),
  cancellationPolicy: z.enum(CancellationPolicy).optional(),
  rentalType: z.enum(RentalType),
  securityDeposit: z.number().nonnegative().optional(),
  address: addressSchema,
});

export const createResidentialEstateDto = baseEstateDto
  .extend({
    bedrooms: z.number().int().positive().optional(),
    bathrooms: z.number().int().positive().optional(),
    beds: z.number().int().positive(),
    minimumStay: z.number().int().positive(),
    maximumStay: z.number().int().positive().optional(),
    pricePerNight: z.number().positive().optional(),
    pricePerMonth: z.number().positive().optional(),
    area: z.number().positive().optional(),
    amenities: z.enum(Amenities).array().optional(),
    residentialType: z.enum(ResidentialType),
    roomType: z.enum(RoomType).optional(),
    guestIncluded: z.number().int().nonnegative(),
    extraPeople: z.number().int().nonnegative().optional(),
    petAllowance: z.boolean().optional(),
    unitsAvailable: z.number().int().positive().optional(),
  })
  .check((ctx) => {
    if (
      ctx.value.rentalType === RentalType.SHORT_TERM &&
      !ctx.value.pricePerNight
    ) {
      ctx.issues.push({
        input: ctx.value.pricePerNight,
        code: "custom",
        message: "Short-term rentals must have a price per night",
      });
    }
    if (
      ctx.value.rentalType === RentalType.LONG_TERM &&
      !ctx.value.pricePerMonth
    ) {
      ctx.issues.push({
        input: ctx.value.pricePerMonth,
        code: "custom",
        message: "Long-term rentals must have a price per month",
      });
    }
    if (ctx.value.pricePerNight && ctx.value.pricePerMonth) {
      ctx.issues.push({
        input: ctx.value.pricePerNight,
        code: "custom",
        message: "Cannot set both price per night and price per month",
      });
    }
    if (
      ctx.value.maximumStay !== undefined &&
      ctx.value.maximumStay < ctx.value.minimumStay
    ) {
      ctx.issues.push({
        input: ctx.value.maximumStay,
        code: "custom",
        message:
          "Maximum nights must be greater than or equal to minimum nights",
      });
    }
  });

export const createBusinessEstateDto = baseEstateDto.extend({
  pricePerMonth: z.number().positive(),
  rentalType: z.literal(RentalType.LONG_TERM), // Only long-term rental for business estates
  unitsAvailable: z.number().int().positive().default(1).optional(),
  area: z.number().positive(),
  intentedUse: z.enum([
    "retail",
    "office",
    "warehouse",
    "hospitality",
    "other",
  ]),
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
  amenities: z.enum(Amenities).array().optional(),
});

export type CreateResidentialEstateDto = z.infer<
  typeof createResidentialEstateDto
>;
export type CreateBusinessEstateDto = z.infer<typeof createBusinessEstateDto>;
