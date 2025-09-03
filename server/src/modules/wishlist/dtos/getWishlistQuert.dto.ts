import { z } from "zod/v4";

export const getWishlistQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  sortBy: z.enum(["createdAt", "updatedAt"]).optional().default("createdAt"),
});

export type GetWishlistQueryDto = z.infer<typeof getWishlistQuerySchema>;
