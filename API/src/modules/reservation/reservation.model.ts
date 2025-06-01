import mongoose from "mongoose";
import { IEstate } from "../estate/estate.model";
import { IUser } from "../user/user.model";
import { Status } from "../../shared/types/status.enum";

export interface IReservation {
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  guestCount: number;
  estateReserved: mongoose.Types.ObjectId | IEstate;
  userOfReservation: mongoose.Types.ObjectId | IUser;
  status: Status;
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
