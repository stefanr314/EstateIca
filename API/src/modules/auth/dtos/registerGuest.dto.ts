import z from "zod";

export const registerGuestDto = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+])[A-Za-z\d@$!%*?&#+]{8,}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#+)",
        }
      ),
    confirmPassword: z.string(),
    phoneNumber: z.string().optional(),
    profilePictureUrl: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterGuestDto = z.infer<typeof registerGuestDto>;
