import mongoose, { Schema, Types, HydratedDocument } from "mongoose";
import { UserDocument } from "../user/user.model";
import { IReview } from "../review/reviews.model";

import { AddressSchema, IAddress } from "../../shared/schema/adress.schema";

import { ResidentialType } from "../../shared/types/residentialType.enum";
import { RoomType } from "../../shared/types/roomType.enum";
import { Amenities } from "../../shared/types/amenities.enum";
import { CancellationPolicy } from "../../shared/types/cancellationPolicy.enum";
import { RentalType } from "../../shared/types/rentalType.enum";

export interface IBaseEstate {
  title: string;
  description: string;
  hidden?: boolean;
  neighborhoodOverview?: string;
  notes?: string;
  houseRules?: string;
  transit?: string;
  access?: string;
  cancellationPolicy?: CancellationPolicy;

  images?: string[];
  rentalType: RentalType; // Required field for rental type, e.g., "short-term" or "long-term"

  securityDeposit?: number;

  host: Types.ObjectId | UserDocument;
  address: IAddress;

  estateType: "ResidentialEstate" | "BusinessEstate"; //estateType field through discriminator key option
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IResidentialEstate extends IBaseEstate {
  bedrooms?: number;
  bathrooms?: number;
  beds: number;
  minimumNights: number;
  maximumNights?: number;
  pricePerNight?: number;
  pricePerMonth?: number; // Optional field for long-term rental price per month
  amenities?: Amenities[];
  residentialType: ResidentialType;
  roomType?: RoomType;
  guestIncluded: number;
  extraPeople?: number;
  petAllowance?: boolean;
  reviews?: (Types.ObjectId | IReview)[]; // Optional field for reviews
  unitsAvailable?: number; // Optional field to indicate the number of units available for long-term rental
}

export interface IBusinessEstate extends Omit<IBaseEstate, "rentalType"> {
  pricePerMonth: number; // Required field for business estates
  unitsAvailable?: number; // Optional field to indicate the number of units available for long-term rental
  area: number; // Required field for area in square meters
  intentedUse: "retail" | "office" | "warehouse" | "hospitality" | "other";
  floor?: number;
  hasElevator?: boolean;
  isGroundFloor?: boolean;
  ceilingHeight?: number;
  hasParking?: boolean;
  parkingSpaces?: number;
  hasRestroom?: boolean;
  minimumLeaseMonths?: number;
  maximumLeaseMonths?: number;
  airConditioning?: boolean;
  internetReady?: boolean;

  amenities?: Amenities[]; // Optional field for business amenities
}

const baseEstateSchema = new Schema<IBaseEstate>(
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
    images: {
      type: [String],
      required: false,
    },
    rentalType: {
      type: String,
      enum: Object.values(RentalType),
      required: true, // Required field for rental type, e.g., "short-term" or "long-term"
    },
    securityDeposit: { type: Number, required: false },
    host: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    address: AddressSchema,
  },
  {
    timestamps: true,
    discriminatorKey: "estateType", // Use discriminatorKey to differentiate between residential and business estates
  }
);

// Add 2dsphere index for geospatial queries
// This index is used for geospatial queries, such as finding estates within a certain distance from a point
baseEstateSchema.index({ "address.location": "2dsphere" });

const residentialEstateSchema = new Schema<IResidentialEstate>({
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
    required: false,
  },
  pricePerNight: {
    type: Number,
    required: function (this: IResidentialEstate) {
      return this.rentalType === RentalType.SHORT_TERM; // Only required if rentalType is SHORT_TERM
    },
  },
  pricePerMonth: {
    type: Number,
    required: function (this: IResidentialEstate) {
      return this.rentalType === RentalType.LONG_TERM; // Only required if rentalType is LONG_TERM
    },
  },
  amenities: [
    {
      type: String,
      enum: Object.values(Amenities),
      required: false,
    },
  ],
  residentialType: {
    type: String,
    enum: Object.values(ResidentialType),
    required: true, // Required field for residential estates
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
  extraPeople: { type: Number, required: false },
  petAllowance: { type: Boolean, required: false },
  reviews: [
    {
      type: Types.ObjectId,
      ref: "Review",
      required: false, // Optional field for reviews
    },
  ],
  unitsAvailable: {
    type: Number,
    required: function (this: IResidentialEstate) {
      return this.rentalType === RentalType.LONG_TERM; // Only required if rentalType is LONG_TERM
    },
  }, // Optional field to indicate the number of units available for long-term rental
});

residentialEstateSchema.pre("validate", function (next) {
  if (this.rentalType === RentalType.SHORT_TERM && !this.pricePerNight) {
    return next(new Error("pricePerNight is required for short-term rentals"));
  }

  if (this.rentalType === RentalType.LONG_TERM && !this.pricePerMonth) {
    return next(new Error("pricePerMonth is required for long-term rentals"));
  }

  if (this.pricePerNight && this.pricePerMonth) {
    return next(
      new Error("Only one of pricePerNight or pricePerMonth should be set")
    );
  }

  next();
});

residentialEstateSchema.pre("save", function (next) {
  if (this.maximumNights && this.maximumNights < this.minimumNights) {
    return next(
      new Error(
        "Maximum nights must be greater than or equal to minimum nights"
      )
    );
  }
  next();
});

const businessEstateSchema = new Schema<IBusinessEstate>({
  pricePerMonth: {
    type: Number,
    required: true, // Required field for business estates
  },

  unitsAvailable: {
    type: Number,
    required: false, // Optional field to indicate the number of units available for long-term rental
  },
  area: {
    type: Number,
    required: true, // Required field for area in square meters
  },
  intentedUse: {
    type: String,
    enum: ["retail", "office", "warehouse", "hospitality", "other"],
    required: true,
  },
  floor: { type: Number, required: false },
  hasElevator: { type: Boolean, required: false },
  isGroundFloor: { type: Boolean, required: false },
  ceilingHeight: { type: Number, required: false },
  hasParking: { type: Boolean, required: false },
  parkingSpaces: { type: Number, required: false },
  hasRestroom: { type: Boolean, required: false },
  minimumLeaseMonths: { type: Number, required: false },
  maximumLeaseMonths: { type: Number, required: false },
  airConditioning: { type: Boolean, required: false },
  internetReady: { type: Boolean, required: false },

  amenities: [
    {
      type: String,
      enum: Object.values(Amenities),
      required: false,
    },
  ], // Optional field for business amenities
});

businessEstateSchema.pre("validate", function (next) {
  const doc = this as unknown as IBaseEstate;
  doc.rentalType = RentalType.LONG_TERM;
  next();
});

export type ResidentialEstateDocument = HydratedDocument<IResidentialEstate>;
export type BusinessEstateDocument = HydratedDocument<IBusinessEstate>;
export type BaseEstateDocument =
  | ResidentialEstateDocument
  | BusinessEstateDocument;

export const BaseEstate = mongoose.model<IBaseEstate>(
  "BaseEstate",
  baseEstateSchema
);

export const ResidentialEstate = BaseEstate.discriminator<IResidentialEstate>(
  "ResidentialEstate",
  residentialEstateSchema
);

export const BusinessEstate = BaseEstate.discriminator<IBusinessEstate>(
  "BusinessEstate",
  businessEstateSchema
);
