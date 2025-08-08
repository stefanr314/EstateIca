import mongoose from "mongoose";
import { UserDocument } from "../user/user.model";
import { BaseEstateDocument } from "../estate/estate.model";

export interface IWishlist {
  user: mongoose.Types.ObjectId | UserDocument;
  estates: [mongoose.Types.ObjectId | BaseEstateDocument];
  createdAt?: Date;
  updatedAt?: Date;
}

const wishlistSchema = new mongoose.Schema<IWishlist>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    estates: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Estate",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

// Metoda za dodavanje smještaja u listu želja
wishlistSchema.methods.addEstateToWishlist = async function (
  estateId: mongoose.Types.ObjectId
) {
  const alreadyAdded = this.estates.includes(estateId);

  if (alreadyAdded) {
    throw new Error("Smeštaj je već na tvojoj listi želja.");
  }

  this.estates.push(estateId);
  await this.save();
};

// Metoda za uklanjanje smještaja iz liste želja
wishlistSchema.methods.removeEstateFromWishlist = async function (
  estateId: mongoose.Types.ObjectId
) {
  const index = this.estates.indexOf(estateId);

  if (index === -1) {
    throw new Error("Smeštaj nije pronađen na tvojoj listi želja.");
  }

  this.estates.splice(index, 1);
  await this.save();
};

export const Wishlist = mongoose.model("Wishlist", wishlistSchema);
