import { z } from "zod/v4";
import { createReviewDto } from "./createReview.dto";

export const updateReviewDto = createReviewDto.partial();

export type UpdateReviewDto = z.infer<typeof updateReviewDto>;
