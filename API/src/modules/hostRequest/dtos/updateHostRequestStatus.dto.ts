import z from "zod";
import { HostRequestStatus } from "../../../shared/types/hostRequest.enum";

export const updateHostRequestStatusDto = z.object({
  status: z.nativeEnum(HostRequestStatus),
  adminComment: z.string().optional(),
});

export type UpdateHostRequestStatusDto = z.infer<
  typeof updateHostRequestStatusDto
>;
