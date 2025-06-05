import z from "zod";
import {
  HostRequestStatus,
  RequestedHostType,
} from "../../../shared/types/hostRequest.enum";
import { HostType } from "../../../shared/types/hostType.enum";

export const getAllHostRequestsDto = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  status: z.nativeEnum(HostRequestStatus).optional(),
  search: z.string().optional(),
  archived: z
    .preprocess(
      (val) => (val === "true" ? true : val === "false" ? false : val),
      z.boolean()
    )
    .optional(),
  requestedType: z.nativeEnum(HostType).optional(),
  sortBy: z
    .string()
    .regex(/^(\w+(:asc|:desc)?)(,\w+(:asc|:desc)?)*$/, {
      message: "Invalid sortBy format. Use 'field:asc,field2:desc' format.",
    })
    .optional(),
});

export type GetAllHostRequestsDto = z.infer<typeof getAllHostRequestsDto>;
