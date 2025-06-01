import mongoose, { Schema, Types } from "mongoose";
import { IUser } from "../user/user.model";
import { IReview } from "../review/reviews.model";

import { AddressSchema, IAddress } from "../../shared/schema/adress.schema";

import { EstateType } from "../../shared/types/estateType.enum";
import { RoomType } from "../../shared/types/roomType.enum";
import { Amenities } from "../../shared/types/amenities.enum";
import { CancellationPolicy } from "../../shared/types/cancellationPolicy.enum";

export interface IEstate {
  title: string;
  description: string;
  hidden?: boolean;
  neighborhoodOverview?: string;
  notes?: string;
  houseRules?: string;
  transit?: string;
  access?: string;
  cancellationPolicy?: CancellationPolicy;
  bedrooms?: number;
  bathrooms?: number;
  beds: number;
  minimumNights: number;
  maximumNights: number;
  price: number;
  amenities?: Amenities[];
  images?: string[];
  estateType: EstateType;
  roomType?: RoomType;
  guestIncluded: number;
  securityDeposit?: number;
  cleaningFee?: number;
  extraPeople?: number;
  petAllowance?: boolean;
  host: Types.ObjectId | IUser;
  address: IAddress;
  availability?: {
    available30?: number;
    available60?: number;
    available90?: number;
    available365?: number;
  };
  reviews?: (Types.ObjectId | IReview)[]; // ili (Types.ObjectId | IReview)[]
  createdAt?: Date;
  updatedAt?: Date;
}

const estateSchema = new Schema<IEstate>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: true,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
    neighborhoodOverview: String,
    notes: String,
    houseRules: String,
    transit: String,
    access: String,
    cancellationPolicy: {
      type: String,
      enum: Object.values(CancellationPolicy),
      required: false,
    },
    bedrooms: {
      type: Number,
      required: false,
    },
    bathrooms: {
      type: Number,
      required: false,
    },
    beds: {
      type: Number,
      required: true,
    },
    minimumNights: {
      type: Number,
      required: true,
    },
    maximumNights: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    amenities: [
      {
        type: String,
        enum: Object.values(Amenities),
        required: false,
      },
    ],
    images: {
      type: [String],
      required: false,
    },
    estateType: {
      type: String,
      enum: Object.values(EstateType),
      required: true,
    },
    roomType: {
      type: String,
      enum: Object.values(RoomType),
      required: false,
    },
    guestIncluded: {
      type: Number,
      required: true,
    },
    securityDeposit: { type: Number, required: false },
    cleaningFee: { type: Number, required: false },
    extraPeople: { type: Number, required: false },
    petAllowance: { type: Boolean, required: false },
    host: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    address: {
      type: AddressSchema,
      required: true,
    },
    availability: {
      type: {
        available30: Number,
        available60: Number,
        available90: Number,
        available365: Number,
      },
      required: false,
    },
    reviews: [
      {
        type: Types.ObjectId,
        required: false,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

// Add 2dsphere index for geospatial queries
// This index is used for geospatial queries, such as finding estates within a certain distance from a point
estateSchema.index({ "address.location": "2dsphere" });

estateSchema.pre("save", function (next) {
  if (this.maximumNights && this.maximumNights < this.minimumNights) {
    const error = new Error(
      "Maximum nights must be greater than or equal to minimum nights"
    );
    return next(error);
  }
  next();
});

export const Estate = mongoose.model("Estate", estateSchema);
