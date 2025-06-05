import mongoose from "mongoose";
import { IEstate } from "../estate/estate.model";
import { IUser } from "../user/user.model";
import { Status } from "../../shared/types/status.enum";
import { RentalType } from "../../shared/types/rentalType.enum";

export interface IReservation {
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  guestCount: number;
  estateReserved: mongoose.Types.ObjectId | IEstate;
  userOfReservation: mongoose.Types.ObjectId | IUser;
  status: Status;
  rentalType: RentalType;
  unitCount?: number; // Optional field for long-term rental unit count
  note?: string; // Optional field for additional notes
  isContractRequired?: boolean; // Optional field to indicate if a contract is required
  createdAt?: Date;
  updatedAt?: Date;
}

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
      required: true,
    },
    estateReserved: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Estate",
      required: true,
    },
    userOfReservation: {
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
    rentalType: {
      type: String,
      enum: Object.values(RentalType),
      required: true,
      default: RentalType.SHORT_TERM,
    },
    unitCount: {
      type: Number,
      required: false, // Optional for long-term rentals
      default: 1, // Default to 1 for short-term rentals
      min: 1, // Ensure at least one unit is reserved
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

export const Reservation = mongoose.model("Reservation", reservationSchema);
