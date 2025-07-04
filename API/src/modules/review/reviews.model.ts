import { Schema, model, Types } from "mongoose";
import { UserDocument } from "../user/user.model";
import { BaseEstateDocument } from "../estate/estate.model";
import { ReservationDocument } from "../reservation/reservation.model";

export interface IReview {
  user: Types.ObjectId | UserDocument;
  estate: Types.ObjectId | BaseEstateDocument;
  reservation?: Types.ObjectId | ReservationDocument;
  userName: string; // ime korisnika koji je ostavio recenziju
  rating: number; // npr. od 1 do 5
  comment?: string | null; // komentar korisnika
  createdAt?: Date;
  updatedAt?: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    estate: {
      type: Schema.Types.ObjectId,
      ref: "Estate",
      required: true,
    },
    reservation: {
      type: Schema.Types.ObjectId,
      ref: "Reservation",
      required: false,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export const Review = model("Review", reviewSchema);
