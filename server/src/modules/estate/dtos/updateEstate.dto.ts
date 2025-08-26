import { z } from "zod/v4";
import {
  createResidentialEstateDto,
  createBusinessEstateDto,
} from "./createEstate.dto";
import { Amenities } from "../../../shared/types/amenities.enum";

export const updateResidentialEstateDto = createResidentialEstateDto.partial();

export const updateBusinessEstateDto = createBusinessEstateDto.partial().refine(
  (data) => {
    if (
      data.minimumLeaseMonths !== undefined &&
      data.maximumLeaseMonths !== undefined
    ) {
      return data.maximumLeaseMonths >= data.minimumLeaseMonths;
    }
    return true;
  },
  {
    message: "maximumLeaseMonths mora biti veći ili jednak minimumLeaseMonths",
    path: ["maximumLeaseMonths"],
  }
);

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
// export const updateEstateDto = baseEstateDto.partial().refine(
//   (data) => {
//     if (data.minimumNights !== undefined && data.maximumNights !== undefined) {
//       return data.maximumNights >= data.minimumNights;
//     }
//     return true; // if one of the fields is missing, skip the check
//   },
//   {
//     message: "maximumNights mora biti veći ili jednak minimumNights",
//     path: ["maximumNights"],
//   }
// );
// export type UpdateEstateDto = z.infer<typeof updateEstateDto>;
