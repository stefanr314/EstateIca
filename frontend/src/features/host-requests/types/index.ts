import { PaginatedResponse } from "@/app/types/api";
import { BasicUserData } from "@/features/auth/types";
import { z } from "zod/v4";

export enum HostType {
  REGULAR = "regular", // običan domaćin
  BUSINESS = "business", // izdaje dugoročno / firme
  BOTH = "both", // oba tipa
}

export interface HostRequestRow {
  _id: string;
  userId: { id: string; email: string };
  requestedType: HostType;
  status: "pending" | "rejected" | "approved";
  archived: boolean;
  reason?: string;
  adminComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HostRequest {
  _id: string;
  user: Omit<BasicUserData, "isHost" | "hostType" | "role">;
  requestedType: HostType;
  status: "pending" | "rejected" | "approved";
  archived: boolean;
  reason?: string;
  businessName?: string;
  businessIdNumber?: string;
  businessAddress?: string;
  adminComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedHRResponse<T> extends PaginatedResponse<T> {
  page: number;
  limit: number;
}

export const createHostRequestDto = z.object({
  requestedType: z.enum(HostType),
  reason: z.string().optional(),
  businessName: z.string().optional(),
  businessIdNumber: z.string().optional(),
  businessAddress: z.string().optional(),
});

export type CreateHostRequestDto = z.infer<typeof createHostRequestDto>;
