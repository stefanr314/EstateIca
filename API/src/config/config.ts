import dotenv from "dotenv";
import logger from "./logging";

dotenv.config();

export const DEVELOPMENT = process.env.NODE_ENV === "development";
export const TEST = process.env.NODE_ENV === "test";
export const PRODUCTION = process.env.NODE_ENV === "production";

export const HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
export const PORT = process.env.SERVER_PORT
  ? Number(process.env.SERVER_PORT)
  : 3000;

export const SERVER = {
  HOSTNAME,
  PORT,
};

const MONGODB_USERNAME = process.env.MONGODB_USERNAME || "";
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || "";
const CLUSTER_URL = process.env.CLUSTER_URL || "";

export const MONGODB_URL = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@${CLUSTER_URL}?retryWrites=true&w=majority&appName=ClusterDipl`;

export const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "defaultSecret";
export const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "defaultSecret";

// if (DEVELOPMENT) {
//   logger.level = "debug"; // Ako je razvojno okruženje, loguj sve detalje
// } else if (TEST) {
//   logger.level = "warn"; // U produkciji samo upozorenja i greške
// }
