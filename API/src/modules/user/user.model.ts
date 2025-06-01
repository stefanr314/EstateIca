import mongoose from "mongoose";
import { Role } from "../../shared/types/role.enum";
import { hash } from "bcryptjs";
import { isStrongPassword } from "../../shared/utils/isStrongPassword";
import { IWishlist } from "../wishlist/wishlist.model";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  profilePictureUrl?: string;
  role: Role;
  isSuperhost: boolean;
  wishlist?: mongoose.Types.ObjectId | IWishlist;
  pushTokens?: string[];
  isVerified: boolean;
  isActive: boolean;
  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  verificationToken?: string;
  verificationExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for email validation
    },
    password: { type: String, required: true, minlength: 8 },
    phoneNumber: { type: String, required: false },
    profilePictureUrl: { type: String, required: false },
    role: { type: String, enum: Object.values(Role), default: Role.GUEST },
    isSuperhost: { type: Boolean, default: false },
    wishlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wishlist",
      required: false,
    },
    pushTokens: {
      type: [String],
      required: false,
    },
    isVerified: { type: Boolean, default: false, required: true },
    isActive: { type: Boolean, default: true, required: true },
    refreshToken: { type: String, required: false },
    resetPasswordToken: { type: String, required: false },
    resetPasswordExpires: { type: Date, required: false },
    verificationToken: { type: String, required: false },
    verificationExpires: { type: Date, required: false },
  },
  { timestamps: true }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`; // Kombinacija imena i prezimena
});

// Middleware za hashiranje lozinke
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Ako lozinka nije promenjena, ne menja ništa

  // Provera jačine lozinke
  if (!isStrongPassword(this.password)) {
    return next(
      new Error(
        "Password is not strong enough. It must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters."
      )
    );
  }

  // Hashiranje lozinke
  this.password = await hash(this.password, 10);
  next();
});

//update.password — if update is direct: { password: "new" }.
// update.$set.password — if update is done with $set: { $set: { password: "new" } }.

userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as any;

  if (!update) return next();

  const password = update.password || (update.$set && update.$set.password);

  if (password) {
    // Provera jačine lozinke
    if (!isStrongPassword(password)) {
      return next(
        new Error(
          "Password is not strong enough. It must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters."
        )
      );
    }
    const hashed = await hash(password, 10);

    if (update.password) {
      update.password = hashed;
    } else if (update.$set && update.$set.password) {
      update.$set.password = hashed;
    }
  }

  next();
});

export const User = mongoose.model("User", userSchema, "users");
