import { z } from "zod/v4";
import {
  createResidentialEstateDto,
  createBusinessEstateDto,
} from "./createEstate.dto";

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

export type UpdateResidentialEstateDto = z.infer<
  typeof updateResidentialEstateDto
>;

export type UpdateBusinessEstateDto = z.infer<typeof updateBusinessEstateDto>;

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
