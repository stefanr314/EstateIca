import { z } from "zod";
import { baseReservationDto } from "./createReservation.dto";
import { Status } from "../../../shared/types/status.enum";

const updateReservationDto = baseReservationDto
  .omit({
    startDate: true,
    endDate: true,
    totalPrice: true,
  })
  .extend({ status: z.nativeEnum(Status) })
  .partial();

export type UpdateReservationDto = z.infer<typeof updateReservationDto>;
