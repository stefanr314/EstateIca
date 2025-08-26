import { z } from "zod/v4";

export const lockDatesDto = z
  .object({
    startDate: z.coerce.date().refine((date) => date > new Date(), {
      error: "Start date must be in the future",
    }),
    endDate: z.coerce.date().refine((date) => date > new Date(), {
      error: "Start date must be in the future",
    }),
    note: z.string().optional(),
  })
  .check((ctx) => {
    if (ctx.value.endDate <= ctx.value.startDate) {
      ctx.issues.push({
        input: ctx.value.endDate,
        path: ["endDate"],
        code: "custom",
        message: "Datum početka mora biti prije datuma završetka",
      });
    }
  });

export const unlockDatesDto = z
  .object({
    startDate: z.coerce.date().refine((date) => date > new Date(), {
      error: "Start date must be in the future",
    }),
    endDate: z.coerce.date().refine((date) => date > new Date(), {
      error: "Start date must be in the future",
    }),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Datum završetka mora biti posle datuma početka",
    path: ["endDate"],
  });

export type LockDatesDto = z.infer<typeof lockDatesDto>;
export type UnlockDatesDto = z.infer<typeof unlockDatesDto>;
