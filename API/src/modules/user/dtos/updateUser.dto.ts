import { z } from "zod/v4";

export const updateUserDto = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  profilePictureUrl: z.url().optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserDto>;
