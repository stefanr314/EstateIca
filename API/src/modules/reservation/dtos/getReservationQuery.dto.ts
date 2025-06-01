import { z } from "zod";
import { Status } from "../../../shared/types/status.enum";

export const getReservationQueryDto = z
  .object({
    estateId: z.string().optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
    startDate: z.coerce
      .date()
      .refine((date) => !isNaN(date.getTime()), {
        message: "Invalid 'startDate' date",
      })
      .optional(),
    endDate: z.coerce
      .date()
      .refine((date) => !isNaN(date.getTime()), {
        message: "Invalid 'endDate' date",
      })
      .optional(),
    status: z.nativeEnum(Status).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startDate && data.endDate && data.startDate > data.endDate) {
      ctx.addIssue({
        path: ["endDate"],
        code: z.ZodIssueCode.custom,
        message: "'End date' date must be after 'start date' date",
      });
    }
  });

export type GetReservationQueryDto = z.infer<typeof getReservationQueryDto>;
