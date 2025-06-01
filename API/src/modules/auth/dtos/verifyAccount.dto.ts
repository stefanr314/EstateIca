import z from "zod";

export const verifyAccountSchema = z.object({
  email: z.string().email(),
});
export type VerifyAccountDto = z.infer<typeof verifyAccountSchema>;
