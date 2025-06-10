import { z } from "zod/v4";

export const loginUserDto = z.object({
  email: z.email().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export type LoginUserDto = z.infer<typeof loginUserDto>;
