// models/address.model.ts (ako ga odvajaš)
import { Schema } from "mongoose";

export interface IAddress {
  country: string;
  city: string;
  postalCode?: string;
  suburb?: string;
  countryCode: string;
  street: string;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
}

// ugnjezdena šema za adresu, bez kreiranja novog modela
export const AddressSchema = new Schema<IAddress>(
  {
    country: { type: String, required: true }, // npr. "Serbia"
    city: { type: String, required: true }, // npr. "Belgrade"
    postalCode: { type: String, required: false }, // npr. "11000"
    suburb: { type: String, required: false }, // npr. "Vracar"
    street: { type: String, required: true }, // npr. "Nemanjina 4"
    countryCode: { type: String, required: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
  },
  { _id: false }
);
