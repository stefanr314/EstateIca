import { z } from "zod";
import { ResidentialType } from "../../../shared/types/residentialType.enum";
import { RoomType } from "../../../shared/types/roomType.enum";
import { Amenities } from "../../../shared/types/amenities.enum";

export const getEstatesQueryDto = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),

  // Filters (svi su optional)
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minBeds: z.coerce.number().min(0).optional(),
  maxBeds: z.coerce.number().min(0).optional(),
  residentialType: z.nativeEnum(ResidentialType).optional(),
  roomType: z.nativeEnum(RoomType).optional(),
  amenities: z.array(z.nativeEnum(Amenities)).optional(),
  petAllowed: z.boolean().optional(),

  // Sorting: 'price' or '-createdAt'
  sortBy: z.string().optional(),

  // Search by city / text
  city: z.string().optional(),
  search: z.string().optional(),
});

export type GetEstatesQueryDto = z.infer<typeof getEstatesQueryDto>;
