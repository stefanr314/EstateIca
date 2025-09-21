import { z } from "zod/v4";

export const registerGuestDto = z
  .object({
    firstName: z.string().min(1, { error: "Ime je obavezno." }),
    lastName: z.string().min(1, { error: "Prezime je obavezno." }),
    email: z.email({ error: "Email adresa nije ispravnog oblika." }),
    password: z
      .string()
      .min(8, { error: "Lozinka mora imati bar 8 karaktera" })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+])[A-Za-z\d@$!%*?&#+]{8,}$/,
        {
          error:
            "Lozinka mora imati bar jedno veliko slovo, jedno malo slovo, jedan broj, te jedan specijani karakter (@$!%*?&#+)",
        }
      ),
    confirmPassword: z.string(),
    phoneNumber: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Sifre se ne poklapaju",
    path: ["confirmPassword"],
  });

export type RegisterGuestDto = z.infer<typeof registerGuestDto>;
