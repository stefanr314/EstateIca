import { z } from "zod";

export const getReviewsQueryDto = z.object({
  estateId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid estate ID format")
    .optional(),
  userId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format")
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type GetReviewsDto = z.infer<typeof getReviewsQueryDto>;
