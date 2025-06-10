// import { z } from "zod";
// import { baseEstateDto } from "./createEstate.dto";

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
