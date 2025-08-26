import { startOfDay } from "date-fns";
import { z } from "zod/v4";

// base DTO for a reservation
export const baseReservationDto = z.object({
  startDate: z.coerce.date().refine((date) => date >= startOfDay(new Date()), {
    error: "Start date must be today or in the future",
  }),
  endDate: z.coerce.date().refine((date) => date >= startOfDay(new Date()), {
    error: "End date must be today or in the future",
  }),
  guestCount: z.number().min(1, { error: "Guest count must be at least 1" }),
  childrenCount: z.number().positive().optional(),
  // estateReserved: z.string({ error: "Invalid estate ID" }),

  note: z.string().optional(),
});

export const createReservationDto = baseReservationDto.check((ctx) => {
  if (ctx.value.endDate <= ctx.value.startDate) {
    ctx.issues.push({
      input: ctx.value.endDate,
      path: ["endDate"],
      code: "custom",
      message: "Datum početka mora biti prije datuma završetka",
    });
  }
});

export const createBusinessReservationDto = baseReservationDto
  .omit({ guestCount: true, childrenCount: true })
  .extend({
    unitCount: z.number().positive().default(1),
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

export type CreateReservationDto = z.infer<typeof createReservationDto>;
export type CreateBusinessReservationDto = z.infer<
  typeof createBusinessReservationDto
>;
