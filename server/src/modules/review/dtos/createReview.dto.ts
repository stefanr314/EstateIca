import { z } from "zod/v4";

export const createReviewDto = z.object({
  comment: z.string().optional(),
  rating: z.coerce
    .number()
    .min(1, "Minimal rate is 1")
    .max(5, "Maximal rate is 5"),
});

export type CreateReviewDto = z.infer<typeof createReviewDto>;
