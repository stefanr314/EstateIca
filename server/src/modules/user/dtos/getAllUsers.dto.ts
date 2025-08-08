import { z } from "zod/v4";

export const getAllUsersQueryDto = z.object({
  page: z.coerce.number().int().default(1),
  limit: z.coerce.number().int().default(10),
  isActive: z.stringbool().optional(),
  isVerified: z.stringbool().optional(),
  search: z.string().optional(),
  // Regex for sortBy: "field:asc,field2:desc"
  sortBy: z
    .string()
    .regex(/^(\w+(:asc|:desc)?)(,\w+(:asc|:desc)?)*$/, {
      message: "Invalid sortBy format. Use 'field:asc,field2:desc' format.",
    })
    .optional(),
});
export type GetAllUsersQueryDto = z.infer<typeof getAllUsersQueryDto>;
