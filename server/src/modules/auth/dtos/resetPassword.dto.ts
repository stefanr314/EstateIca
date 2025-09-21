import { z } from "zod/v4";

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
    resetToken: z
      .string()
      .length(128)
      .regex(/^[a-f0-9]{128}$/, { error: "Neispravan format tokena." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Lozinke se ne poklapaju.",
    path: ["confirmPassword"],
  });

export type ResetPasswordDto = z.infer<typeof resetPasswordDto>;
