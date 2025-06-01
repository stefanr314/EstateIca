import { z } from "zod";

export const resetPasswordDto = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+])[A-Za-z\d@$!%*?&#+]{8,}$/,
        {
          message:
            "Password must contain uppercase, lowercase, number, and special character",
        }
      ),
    confirmPassword: z.string(),
    resetToken: z
      .string()
      .length(128)
      .regex(/^[a-f0-9]{128}$/, { message: "Invalid token format" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordDto = z.infer<typeof resetPasswordDto>;
