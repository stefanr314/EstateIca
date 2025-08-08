import { z } from "zod/v4";

export const registerGuestDto = z
  .object({
    firstName: z.string().min(1, { error: "First name is required" }),
    lastName: z.string().min(1, { error: "Last name is required" }),
    email: z.email({ error: "Invalid email address" }),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters long" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+])[A-Za-z\d@$!%*?&#+]{8,}$/,
        {
          error:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#+)",
        }
      ),
    confirmPassword: z.string(),
    phoneNumber: z.string().optional(),
    profilePictureUrl: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterGuestDto = z.infer<typeof registerGuestDto>;
