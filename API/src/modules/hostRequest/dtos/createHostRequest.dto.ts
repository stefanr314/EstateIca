import { z } from "zod";
import { RequestedHostType } from "../../../shared/types/hostRequest.enum";
import { HostType } from "../../../shared/types/hostType.enum";

export const createHostRequestDto = z.object({
  requestedType: z.nativeEnum(HostType),
  reason: z.string().optional(),
  businessName: z.string().optional(),
  businessIdNumber: z.string().optional(),
  businessAddress: z.string().optional(),
});

export type CreateHostRequestDto = z.infer<typeof createHostRequestDto>;
