import z from "zod/v4";

export const hardDeleteEstateDto = z.object({
  userPassword: z.string().nonempty(),
});

export type HardDeleteEstateDto = z.infer<typeof hardDeleteEstateDto>;
