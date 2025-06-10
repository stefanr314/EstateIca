import { z } from "zod/v4";

export const getWishlistQuerySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export type GetWishlistQueryDto = z.infer<typeof getWishlistQuerySchema>;
