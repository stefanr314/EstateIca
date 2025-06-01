import z from "zod";

export const updateUserDto = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  profilePictureUrl: z.string().url().optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserDto>;
