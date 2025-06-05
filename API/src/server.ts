import http from "http";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import "./config/logging";
// import logger from "./config/logging";
import { HOSTNAME, PORT } from "./config/config";
import logger from "./config/pinoLogger";
import { loggingHandler } from "./shared/middlewares/loggingInfo";
import { routeNotFound } from "./shared/middlewares/routeNotFound";

import authRoutes from "./modules/auth/auth.route";
import userRoutes from "./modules/user/user.route";
import hostRequestRoutes from "./modules/hostRequest/hostRequest.route";

import connectDB from "./shared/utils/db";
import { errorHandler } from "./shared/middlewares/errorHandler";
import helmet from "helmet";

// === 1. HANDLE UNCAUGHT EXCEPTIONS ===
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception! Shutting down...");
  logger.error(err);
  process.exit(1); // Obavezno gasi jer je stanje nesigurno
});

export const app = express();
export let httpServer: ReturnType<typeof http.createServer>;

// const corsOptions = {
//   origin: "http://localhost:5173", // Port na kojem je tvoj frontend (Vite default)
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"], // Dodaj sve potrebne zaglavlja
// };

export const Main = () => {
  app.use(helmet());
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(morgan(":method :url :status"));

  app.use(loggingHandler);

  app.use("/auth", authRoutes);
  app.use("/user", userRoutes);
  app.use("/host-request", hostRequestRoutes);

  app.use(routeNotFound);
  app.use(errorHandler);

  httpServer = http.createServer(app);
  httpServer.listen(PORT, () => {
    logging.log("Ovo je debug poruka");
    logging.warn("Ovo je upozorenje");
    logging.error("Došlo je do greške");
    logging.info(`Server pokrenut na http://${HOSTNAME}:${PORT}`);
    logger.info(`Server pokrenut na http://${HOSTNAME}:${PORT}`);
  });
};

export const ShutDown = (callback: any) =>
  httpServer && httpServer.close(callback);

const startServer = async () => {
  console.time("🟢 Server start");
  console.time("⏳ DB connect");

  await connectDB();

  console.timeEnd("⏳ DB connect");
  Main();
  console.timeEnd("🟢 Server start");
};

// === 2. HANDLE UNHANDLED PROMISES ===
process.on("unhandledRejection", (reason: any) => {
  logger.error("Unhandled Rejection! Shutting down...");
  logger.error(reason);

  ShutDown(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server");
  ShutDown(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });
});

startServer();
