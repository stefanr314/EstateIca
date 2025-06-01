import { z } from "zod";

export const paramsReviewDto = z.object({
  reservationId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid reservation ID format"),
  estateId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid estate ID format")
    .optional(),
});

export type ParamsReviewDto = z.infer<typeof paramsReviewDto>;
