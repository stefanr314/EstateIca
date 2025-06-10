import { z } from "zod/v4";

export const verifyAccountSchema = z.object({
  email: z.email(),
});
export type VerifyAccountDto = z.infer<typeof verifyAccountSchema>;
