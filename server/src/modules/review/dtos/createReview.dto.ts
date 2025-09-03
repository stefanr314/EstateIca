import { z } from "zod/v4";

export const createReviewDto = z.object({
  comment: z.string().optional(),
  rating: z.object({
    overall: z.number().min(1).max(10),
    cleanliness: z.number().min(1).max(10),
    amenities: z.number().min(1).max(10),
    host: z.number().min(1).max(10),
    location: z.number().min(1).max(10),
  }),
});

export type CreateReviewDto = z.infer<typeof createReviewDto>;
