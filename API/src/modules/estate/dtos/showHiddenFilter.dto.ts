import { z } from "zod/v4";
import { RentalType } from "../../../shared/types/rentalType.enum";

export const personalEstateFilterDto = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  estateType: z.enum(["ResidentialEstate", "BusinessEstate"]).optional(),
  rentalType: z.enum(RentalType).optional(),
  showHidden: z.stringbool().optional(),
  sortBy: z.string().optional(),
});

export type PersonalEstateFilterDto = z.infer<typeof personalEstateFilterDto>;
