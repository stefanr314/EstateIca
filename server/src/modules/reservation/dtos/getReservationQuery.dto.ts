import { z } from "zod/v4";
import { Status } from "../../../shared/types/status.enum";

export const getReservationQueryDto = z
  .object({
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
    status: z.enum(Status).optional(),
    sortBy: z.string().optional(),
    // sortOrder: z.enum(["asc", "desc"]).default("asc"),
  })
  .check((ctx) => {
    if (
      ctx.value.startDate &&
      ctx.value.endDate &&
      ctx.value.startDate > ctx.value.endDate
    ) {
      ctx.issues.push({
        input: ctx.value.endDate,
        path: ["endDate"],
        code: "custom",
        message: "'End date' date must be after 'start date' date",
      });
    }
  });

export const getPendingReservationQueryDto = getReservationQueryDto
  .omit({
    status: true,
  })
  .extend({ type: z.enum(["Business", "Residential"]).optional() });

export type GetReservationQueryDto = z.infer<typeof getReservationQueryDto>;
export type GetPendingReservationQueryDto = z.infer<
  typeof getPendingReservationQueryDto
>;
