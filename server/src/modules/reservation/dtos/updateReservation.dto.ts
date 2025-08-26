import { z } from "zod/v4";
import {
  createBusinessReservationDto,
  createReservationDto,
} from "./createReservation.dto";
import { startOfDay } from "date-fns";

export const updateResidentialReservationGuestCountDto = createReservationDto
  .omit({
    startDate: true,
    endDate: true,
  })
  .partial();

export const updateBusinessReservationUnitCountDto =
  createBusinessReservationDto
    .omit({ endDate: true, startDate: true })
    .partial({ note: true });

export const updateReservationDateDto = createReservationDto
  .omit({
    guestCount: true,
    childrenCount: true,
  })
  .partial({ note: true });

export const extendReservationDto = z.object({
  newEndDate: z.coerce.date().refine((date) => date >= startOfDay(new Date()), {
    error: "End date must be today or in the future",
  }),
  note: z.string().optional(),
});

export type UpdateResidentialReservationGuestCountDto = z.infer<
  typeof updateResidentialReservationGuestCountDto
>;

export type UpdateBusinessReservationUnitCountDto = z.infer<
  typeof updateBusinessReservationUnitCountDto
>;

export type UpdateReservationDateDto = z.infer<typeof updateReservationDateDto>;
export type ExtendReservationDto = z.infer<typeof extendReservationDto>;
