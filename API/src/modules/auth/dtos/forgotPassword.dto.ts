import { z } from "zod";

export const forgotPasswordDto = z.object({
  email: z.string().email({ message: "Valid email is required" }),
});

export type ForgotPasswordDto = z.infer<typeof forgotPasswordDto>;
