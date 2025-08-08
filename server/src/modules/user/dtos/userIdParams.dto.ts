import { z } from "zod/v4";

// This file defines a Zod schema for validating user ID parameters in API requests.
export const userIdParamsDto = z.object({
  userId: z.string(),
});
export type UserIdParamsDto = z.infer<typeof userIdParamsDto>;
