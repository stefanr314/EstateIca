import { z } from "zod/v4";
import { HostRequestStatus } from "../../../shared/types/hostRequest.enum";

export const updateHostRequestStatusDto = z.object({
  status: z.enum(HostRequestStatus),
  adminComment: z.string().optional(),
});

export type UpdateHostRequestStatusDto = z.infer<
  typeof updateHostRequestStatusDto
>;
