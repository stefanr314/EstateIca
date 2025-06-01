import { z } from "zod";

// Za dobijanje korisnika po ID iz URL-a
export const userIdParamsDto = z.object({
  userId: z.string(), // ili string ako ti nije UUID
});
export type UserIdParamsDto = z.infer<typeof userIdParamsDto>;
