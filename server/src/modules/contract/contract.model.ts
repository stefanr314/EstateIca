import mongoose, { HydratedDocument } from "mongoose";
import { ReservationDocument } from "../reservation/reservation.model";

export enum ContractStatus {
  DRAFT = "draft",
  SIGNED = "signed",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
}

export interface IContract {
  reservationId: mongoose.Types.ObjectId | ReservationDocument;
  contractFileUrl: string;
  validFrom: Date;
  validTo: Date;
  signedByHost: boolean;
  signedByTenant: boolean;
  status: ContractStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
export type ContractDocument = HydratedDocument<IContract>;

const contractSchema = new mongoose.Schema<IContract>(
  {
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservation",
      required: true,
    },
    contractFileUrl: {
      type: String,
      required: true,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validTo: {
      type: Date,
      required: true,
    },
    signedByHost: {
      type: Boolean,
      default: false,
    },
    signedByTenant: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: Object.values(ContractStatus),
      default: ContractStatus.DRAFT,
    },
  },
  { timestamps: true }
);

export const Contract = mongoose.model("Contract", contractSchema);
