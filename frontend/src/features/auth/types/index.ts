import z from "zod/v4";

// ========== Types ==========
export interface BasicUserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture?: string;
  isHost?: boolean;
  phoneNumber?: string;
  role: "guest" | "host" | "admin";
  isVerified: boolean;
  isActive: boolean;
  hostType?: "regular" | "business" | "both";
}

export interface AuthState {
  user: BasicUserData | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "failed" | "succeeded";
}

// ========== Schemas ==========
export const registerUserDto = z
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterUserDto = z.infer<typeof registerUserDto>;

export const resetPasswordDto = z
  .object({
    password: z
      .string()
      .min(8, { error: "Lozinka mora imati bar 8 karaktera." })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+])[A-Za-z\d@$!%*?&#+]{8,}$/,
        {
          error:
            "Lozinka mora imati bar jedno veliko slovo, jedno malo slovo, broj, te specijalni karakter.",
        }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Lozinke se ne poklapaju.",
    path: ["confirmPassword"],
  });

export type ResetPasswordDto = z.infer<typeof resetPasswordDto>;
