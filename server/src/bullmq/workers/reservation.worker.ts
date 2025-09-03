// src/workers/reservation.worker.ts
import { Worker } from "bullmq";
import connection from "../bullmq.config";
import { Reservation } from "../../modules/reservation/reservation.model";
import { Status } from "../../shared/types/status.enum";
import mongoose from "mongoose";
import { MONGODB_URL } from "../../config/config";

// prvo se poveži na bazu
mongoose.connect(MONGODB_URL).then(() => {
  console.log("✅ Worker connected to MongoDB");
});

const reservationWorker = new Worker(
  "reservation",
  async (job) => {
    if (job.name === "completeReservation") {
      const { reservationId } = job.data;

      const reservation = await Reservation.findById(reservationId);

      if (
        reservation &&
        reservation.status === Status.CONFIRMED &&
        Date.now() >= new Date(reservation.endDate).getTime()
      ) {
        reservation.status = Status.COMPLETED;
        await reservation.save();
      }

      return { success: true };
    }
  },
  { connection }
);

reservationWorker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} completed`);
});

reservationWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed: ${err.message}`);
});
