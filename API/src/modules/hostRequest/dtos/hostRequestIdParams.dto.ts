import { z } from "zod/v4";

export const hostRequestIdParamsSchema = z.object({
  requestId: z.string().min(1, "Request ID must be at least 1 character long"),
});

export type HostRequestIdParamsDto = z.infer<typeof hostRequestIdParamsSchema>;
