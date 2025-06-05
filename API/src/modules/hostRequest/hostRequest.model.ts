import mongoose from "mongoose";
import { IUser } from "../user/user.model";
import {
  HostRequestStatus,
  RequestedHostType,
} from "../../shared/types/hostRequest.enum";
import { HostType } from "../../shared/types/hostType.enum";

export interface IHostRequest {
  user: mongoose.Types.ObjectId | IUser;
  requestedType: HostType;
  status: HostRequestStatus;
  archived: boolean; // Optional field to track if the request has been archived
  reason?: string;
  businessName?: string;
  businessIdNumber?: string;
  businessAddress?: string;
  adminComment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const hostRequestSchema = new mongoose.Schema<IHostRequest>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // single user can have only one host request
    },
    requestedType: {
      type: String,
      enum: Object.values(HostType),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(HostRequestStatus),
      default: HostRequestStatus.PENDING,
    },
    archived: {
      type: Boolean,
      default: false, // Indicates if the request has been archived
    },
    reason: {
      type: String,
    },
    businessName: {
      type: String,
    },
    businessIdNumber: {
      type: String,
    },
    businessAddress: {
      type: String,
    },
    adminComment: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Validate that if the requestedType is "business", the business fields are provided
hostRequestSchema.pre("save", function (next) {
  if (this.requestedType === "business") {
    if (!this.businessName || !this.businessIdNumber || !this.businessAddress) {
      next(new Error("Missing business information for business host request"));
      return;
    }
  }
  next();
});

export const HostRequest = mongoose.model("HostRequest", hostRequestSchema);
