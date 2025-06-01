import mongoose from "mongoose";
import { IEstate } from "../estate/estate.model";
import { IUser } from "../user/user.model";

export interface IWishlist {
  user: mongoose.Types.ObjectId | IUser;
  estates: [mongoose.Types.ObjectId | IEstate];
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
