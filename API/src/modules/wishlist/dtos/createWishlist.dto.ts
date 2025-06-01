import { z } from "zod";

export const createWishlistDto = z.object({
  estates: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)),
});

export type CreateWishlistDto = z.infer<typeof createWishlistDto>;
