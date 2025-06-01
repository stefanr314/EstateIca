import { z } from "zod";

// base DTO for a reservation
export const baseReservationDto = z.object({
  startDate: z.date().refine((date) => date > new Date(), {
    message: "Start date must be in the future",
  }),
  endDate: z.date().refine((date) => date > new Date(), {
    message: "End date must be in the future",
  }),
  totalPrice: z
    .number()
    .positive({ message: "Total price must be a positive number" }),
  guestCount: z.number().min(1, { message: "Guest count must be at least 1" }),
  // estateReserved: z.string().uuid({ message: "Invalid estate ID" }),
});

export const createReservationDto = baseReservationDto.superRefine(
  (data, ctx) => {
    if (data.endDate <= data.startDate) {
      ctx.addIssue({
        path: ["endDate"],
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date",
      });
    }
  }
);

export type CreateReservationDto = z.infer<typeof createReservationDto>;
