import { z } from "zod/v4";

export const createWishlistDto = z.object({
  estates: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)),
});

export type CreateWishlistDto = z.infer<typeof createWishlistDto>;
