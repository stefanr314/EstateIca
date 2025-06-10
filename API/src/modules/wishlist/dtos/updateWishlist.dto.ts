import { z } from "zod/v4";

export const updateWishlistSchema = z.object({
  estates: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).nonempty(),
});
export type UpdateWishlistDto = z.infer<typeof updateWishlistSchema>;
