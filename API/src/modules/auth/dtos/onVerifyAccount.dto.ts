import z from "zod";

export const onVerifyAccountDto = z.object({
  token: z
    .string()
    .min(128)
    .max(128, "Token must be exactly 128 characters long"),
});
export type OnVerifyAccountDto = z.infer<typeof onVerifyAccountDto>;
