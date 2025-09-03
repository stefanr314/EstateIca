import mongoose from "mongoose";
import { MONGODB_URL } from "../../config/config";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(MONGODB_URL);
    logging.log(`MongoDB Connected: ${conn.connection.host}`);
    logging.log(`MongoDB Connected: ${conn.connection.db?.databaseName}`);
  } catch (error) {
    logging.error(
      "Error connecting to the database:",
      error instanceof Error ? error.message : error
    );
    process.exit(1); // Ako se dogodi greška u povezivanju s bazom, zaustavi aplikaciju
  }
};

export default connectDB;
