import { Queue } from "bullmq";
import connection from "../bullmq.config";

export const reservationQueue = new Queue("reservation", { connection });
