import { z } from "zod/v4";

// base DTO for a reservation
export const baseReservationDto = z.object({
  startDate: z.date().refine((date) => date > new Date(), {
    error: "Start date must be in the future",
  }),
  endDate: z.date().refine((date) => date > new Date(), {
    error: "End date must be in the future",
  }),
  totalPrice: z
    .number()
    .positive({ error: "Total price must be a positive number" }),
  guestCount: z.number().min(1, { error: "Guest count must be at least 1" }),
  // estateReserved: z.string().uuid({ error: "Invalid estate ID" }),
});

export const createReservationDto = baseReservationDto.check((ctx) => {
  if (ctx.value.endDate <= ctx.value.startDate) {
    ctx.issues.push({
      input: ctx.value.endDate,
      path: ["endDate"],
      code: "custom",
      message: "End date must be after start date",
    });
  }
});

export type CreateReservationDto = z.infer<typeof createReservationDto>;
