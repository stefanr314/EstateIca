import mongoose, { HydratedDocument } from "mongoose";
import { BaseEstateDocument } from "../estate/estate.model";
import { UserDocument } from "../user/user.model";
import { Status } from "../../shared/types/status.enum";
import { RentalType } from "../../shared/types/rentalType.enum";
import { required } from "zod/v4-mini";

export interface IReservation {
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  guestCount: number;
  childrenCount?: number;
  estateReserved: mongoose.Types.ObjectId | BaseEstateDocument;
  userOfReservation: mongoose.Types.ObjectId | UserDocument;
  hostOfReservedEstate: mongoose.Types.ObjectId | UserDocument;
  status: Status;
  pendingChange?: {
    type: "EXTEND" | "UPDATE_DATE";
    newStartDate?: Date;
    newEndDate?: Date;
    extraPrice?: number;
    totalPrice: number;
    note?: string;
  };
  pendingContractChange?: {
    newUnitCount: number;
    note?: string;
  };
  rentalType: RentalType;
  hostName: string;
  guestName: string;
  estateTitle: string;
  pricePerNight: number;
  pricePerMonth: number;
  extraPeopleFee?: number;
  childrenDiscount?: number;
  unitCount?: number; // Optional field for long-term rental unit count
  note?: string; // Optional field for additional notes
  isContractRequired?: boolean; // Optional field to indicate if a contract is required
  createdAt?: Date;
  updatedAt?: Date;
}
export type ReservationDocument = HydratedDocument<IReservation>;

const pendingChangeSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["EXTEND", "UPDATE_DATE"], required: true },
    newStartDate: { type: Date },
    newEndDate: { type: Date },
    extraPrice: { type: Number },
    totalPrice: { type: Number, required: true },
    note: { type: String },
  },
  { _id: false }
);

const pendingContractChangeSchema = new mongoose.Schema(
  {
    newUnitCount: { type: Number, required: true },
    note: { type: String },
  },
  { _id: false }
);

const reservationSchema = new mongoose.Schema<IReservation>(
  {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    guestCount: {
      type: Number,
      required: function () {
        return this.rentalType === RentalType.SHORT_TERM;
      },
      min: 1,
    },
    childrenCount: {
      type: Number,
      required: false,
    },
    estateReserved: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BaseEstate",
      required: true,
    },
    userOfReservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hostOfReservedEstate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(Status),
      required: true,
      default: Status.PENDING,
    },
    pendingChange: { type: pendingChangeSchema, required: false },
    pendingContractChange: {
      type: pendingContractChangeSchema,
      required: false,
    },
    rentalType: {
      type: String,
      enum: Object.values(RentalType),
      required: true,
      default: RentalType.SHORT_TERM,
    },
    hostName: {
      type: String,
      required: true,
    },
    guestName: { type: String, required: true },
    estateTitle: { type: String, required: true },
    pricePerNight: {
      type: Number,
      required: function () {
        return this.rentalType === RentalType.SHORT_TERM;
      },
    },
    pricePerMonth: {
      type: Number,
      required: function () {
        return this.rentalType === RentalType.LONG_TERM;
      },
    },
    unitCount: {
      type: Number,
      required: false, // Optional for long-term rentals
      default: 1, // Default to 1 for short-term rentals
      min: 1, // Ensure at least one unit is reserved
    },
    extraPeopleFee: {
      type: Number,
      required: false,
      default: 0,
    },
    childrenDiscount: {
      type: Number,
      required: false,
      default: 0,
    },
    note: {
      type: String,
      required: false, // Optional field for additional notes
      maxlength: 1000, // Limit note length to 500 characters
    },
    isContractRequired: {
      type: Boolean,
      required: false, // Optional field to indicate if a contract is required
      default: false, // Default to false for short-term rentals
    },
  },
  { timestamps: true }
);

reservationSchema.pre("save", function (next) {
  if (this.startDate > this.endDate) {
    return next(new Error("Start date cannot be after end date"));
  }
  next();
});
reservationSchema.pre("validate", function (next) {
  if (this.pricePerNight && this.pricePerMonth) {
    return next(
      new Error("Only one of pricePerNight or pricePerMonth should be set")
    );
  }
  next();
});

reservationSchema.index(
  { estateReserved: 1, status: 1, startDate: 1 },
  { name: "estate_status_startDate_idx" }
);
reservationSchema.index(
  { estateReserved: 1, status: 1, endDate: 1 },
  { name: "estate_status_endDate_idx" }
);

reservationSchema.index(
  { estateReserved: 1, status: 1, startDate: 1, endDate: 1 },
  { name: "estate_status_start_end_idx" }
);
export const Reservation = mongoose.model("Reservation", reservationSchema);
