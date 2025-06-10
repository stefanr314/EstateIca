import { z } from "zod/v4";

import { HostType } from "../../../shared/types/hostType.enum";

export const createHostRequestDto = z.object({
  requestedType: z.enum(HostType),
  reason: z.string().optional(),
  businessName: z.string().optional(),
  businessIdNumber: z.string().optional(),
  businessAddress: z.string().optional(),
});

export type CreateHostRequestDto = z.infer<typeof createHostRequestDto>;
