import { z } from "zod/v4";
import { Status } from "../../../shared/types/status.enum";

export const updateReservationStatusDto = z.object({
  status: z.enum(Status),
});

export type UpdateReservationStatusDto = z.infer<
  typeof updateReservationStatusDto
>;
