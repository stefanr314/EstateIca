import z from "zod/v4";

export const estateIdParams = z.object({
  estateId: z.string(),
});

export type EstateIdParams = z.infer<typeof estateIdParams>;
