import { Schema, model, Types } from "mongoose";
import { UserDocument } from "../user/user.model";
import { BaseEstateDocument } from "../estate/estate.model";
import { ReservationDocument } from "../reservation/reservation.model";

export interface IReview {
  user: Types.ObjectId | UserDocument;
  estate: Types.ObjectId | BaseEstateDocument;
  reservation: Types.ObjectId | ReservationDocument;
  userFullName: string;
  rating: {
    overall: number;
    cleanliness: number;
    amenities: number;
    host: number;
    location: number;
  };
  comment?: string | null;
  editCount: number;
  editDeadline?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userFullName: { type: String, required: true },
    estate: { type: Schema.Types.ObjectId, ref: "Estate", required: true },
    reservation: {
      type: Schema.Types.ObjectId,
      ref: "Reservation",
      required: true,
    },

    rating: {
      overall: { type: Number, required: true, min: 1, max: 10 },
      cleanliness: { type: Number, required: true, min: 1, max: 10 },
      amenities: { type: Number, required: true, min: 1, max: 10 },
      host: { type: Number, required: true, min: 1, max: 10 },
      location: { type: Number, required: true, min: 1, max: 10 },
    },

    comment: { type: String },
    editCount: { type: Number, required: true, default: 0 },
    editDeadline: { type: Date },
  },
  { timestamps: true }
);

// Jedinstvena kombinacija kako korisnik ne bi mogao ostaviti više recenzija za isti smještaj u sklopu iste rezervacije
reviewSchema.index({ user: 1, estate: 1, reservation: 1 }, { unique: true });

export const Review = model("Review", reviewSchema);
