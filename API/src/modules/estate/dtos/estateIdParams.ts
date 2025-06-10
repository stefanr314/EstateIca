import z from "zod";

export const estateIdParams = z.object({
  estateId: z.string(),
});

export type EstateIdParams = z.infer<typeof estateIdParams>;
