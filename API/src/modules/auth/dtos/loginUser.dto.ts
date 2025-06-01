import z from "zod";

export const loginUserDto = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export type LoginUserDto = z.infer<typeof loginUserDto>;
