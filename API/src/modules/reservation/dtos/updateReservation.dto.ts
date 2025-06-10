import { z } from "zod/v4";
import { baseReservationDto } from "./createReservation.dto";
import { Status } from "../../../shared/types/status.enum";

const updateReservationDto = baseReservationDto
  .omit({
    startDate: true,
    endDate: true,
    totalPrice: true,
  })
  .extend({ status: z.enum(Status) })
  .partial();

export type UpdateReservationDto = z.infer<typeof updateReservationDto>;
