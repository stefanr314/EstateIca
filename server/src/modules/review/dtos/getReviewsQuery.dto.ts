import { z } from "zod/v4";

export const getReviewsQueryDto = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
});

export type GetReviewsDto = z.infer<typeof getReviewsQueryDto>;
