import z from "zod";

export const getAllUsersQueryDto = z.object({
  page: z
    .preprocess((val) => parseInt(val as string), z.number().int().min(1))
    .default(1)
    .optional(),
  limit: z
    .preprocess((val) => parseInt(val as string), z.number().int().min(1))
    .default(10)
    .optional(),
  isActive: z.preprocess((val) => val === "true", z.boolean()).optional(),
  isVerified: z.preprocess((val) => val === "true", z.boolean()).optional(),
  isSuperhost: z.preprocess((val) => val === "true", z.boolean()).optional(),
  search: z.string().optional(),
  // Regex for sortBy: "field:asc,field2:desc"
  sortBy: z
    .string()
    .regex(/^(\w+(:asc|:desc)?)(,\w+(:asc|:desc)?)*$/)
    .optional(),
});
export type GetAllUsersQueryDto = z.infer<typeof getAllUsersQueryDto>;
