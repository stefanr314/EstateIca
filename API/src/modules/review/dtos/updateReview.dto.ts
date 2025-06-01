import { z } from "zod";
import { createReviewDto } from "./createReview.dto";

export const updateReviewDto = createReviewDto.partial();

export type UpdateReviewDto = z.infer<typeof updateReviewDto>;
