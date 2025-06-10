// import { z } from "zod";
// import { ResidentialType } from "../../../shared/types/residentialType.enum";
// import { RoomType } from "../../../shared/types/roomType.enum";
// import { CancellationPolicy } from "../../../shared/types/cancellationPolicy.enum";
// import { Amenities } from "../../../shared/types/amenities.enum";

// export const addressSchema = z.object({
//   country: z.string(),
//   city: z.string(),
//   postalCode: z.string().optional(),
//   suburb: z.string().optional(),
//   countryCode: z.string(),
//   location: z.object({
//     type: z.literal("Point"),
//     coordinates: z.tuple([
//       z.number().min(-180).max(180),
//       z.number().min(-90).max(90),
//     ]), // [lng, lat]
//   }),
// });

// export const baseEstateDto = z.object({
//   title: z.string().min(3).max(100),
//   description: z.string().min(1),
//   neighborhoodOverview: z.string().optional(),
//   notes: z.string().optional(),
//   houseRules: z.string().optional(),
//   transit: z.string().optional(),
//   access: z.string().optional(),
//   cancellationPolicy: z.nativeEnum(CancellationPolicy).optional(),
//   bedrooms: z.number().optional(),
//   bathrooms: z.number().optional(),
//   beds: z.number().min(1),
//   minimumNights: z.number().min(1),
//   maximumNights: z.number().optional(),
//   pricePerNight: z.number().positive(),
//   guestIncluded: z.number().min(1),
//   estateType: z.nativeEnum(ResidentialType),
//   roomType: z.nativeEnum(RoomType).optional(),
//   amenities: z.array(z.nativeEnum(Amenities)).optional(),
//   images: z.array(z.string().url()).optional(),
//   securityDeposit: z.number().optional(),
//   cleaningFee: z.number().optional(),
//   extraPeople: z.number().optional(),
//   petAllowance: z.boolean().optional(),
//   address: addressSchema,
//   isLongTerm: z.boolean().default(false),
// });

// //Check the values of min and max nights
// // If min is greater than max, throw an error
// export const createEstateDto = baseEstateDto.superRefine((data, ctx) => {
//   if (
//     data.maximumNights !== undefined &&
//     data.maximumNights < data.minimumNights
//   ) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: "maximumNights must be greater than or equal to minimumNights",
//       path: ["maximumNights"],
//     });
//   }
// });
// export type CreateEstateDto = z.infer<typeof createEstateDto>;
