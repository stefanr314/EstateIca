import mongoose from "mongoose";
import { MONGODB_URL } from "../../config/config";

let isConnected = false;

mongoose.connection.on("disconnected", () => {
  logging.warn("⚠️ MongoDB disconnected!");
  isConnected = false;
});

const connectDB = async (): Promise<void> => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(MONGODB_URL);
    isConnected = true;
    logging.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logging.error(
      "Error connecting to the database:",
      error instanceof Error ? error.message : error
    );
    process.exit(1); // Ako se dogodi greška u povezivanju s bazom, zaustavi aplikaciju
  }
};

export default connectDB;
