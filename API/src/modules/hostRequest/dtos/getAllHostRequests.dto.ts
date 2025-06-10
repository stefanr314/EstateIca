import { stringbool, z } from "zod/v4";
import { HostRequestStatus } from "../../../shared/types/hostRequest.enum";
import { HostType } from "../../../shared/types/hostType.enum";

export const getAllHostRequestsDto = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  status: z.enum(HostRequestStatus).optional(),
  search: z.string().optional(),
  archived: z.stringbool().optional(),
  requestedType: z.enum(HostType).optional(),
  sortBy: z
    .string()
    .regex(/^(\w+(:asc|:desc)?)(,\w+(:asc|:desc)?)*$/, {
      error: "Invalid sortBy format. Use 'field:asc,field2:desc' format.",
    })
    .optional(),
});

export type GetAllHostRequestsDto = z.infer<typeof getAllHostRequestsDto>;
