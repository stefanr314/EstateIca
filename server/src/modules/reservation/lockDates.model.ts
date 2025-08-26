import mongoose from "mongoose";
export interface ILockDate {
  startDate: Date;
  endDate: Date;
  estate: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  note?: string; // opcionalno, da vlasnik zna razlog
}
const lockDateSchema = new mongoose.Schema<ILockDate>(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    estate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Estate",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    note: { type: String },
  },
  { timestamps: true }
);

lockDateSchema.index(
  { estate: 1, startDate: 1, endDate: 1 },
  { name: "lockdate_availability_index" }
);

export const LockDate = mongoose.model("LockDate", lockDateSchema);
