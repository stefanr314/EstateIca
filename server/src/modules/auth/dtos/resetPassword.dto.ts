import { z } from "zod/v4";

export const resetPasswordDto = z
  .object({
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters long" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+])[A-Za-z\d@$!%*?&#+]{8,}$/,
        {
          error:
            "Password must contain uppercase, lowercase, number, and special character",
        }
      ),
    confirmPassword: z.string(),
    resetToken: z
      .string()
      .length(128)
      .regex(/^[a-f0-9]{128}$/, { error: "Invalid token format" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordDto = z.infer<typeof resetPasswordDto>;
