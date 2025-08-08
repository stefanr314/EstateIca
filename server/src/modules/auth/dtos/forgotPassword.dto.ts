import { z } from "zod/v4";

export const forgotPasswordDto = z.object({
  email: z.email({ error: "Valid email is required" }),
});

export type ForgotPasswordDto = z.infer<typeof forgotPasswordDto>;
