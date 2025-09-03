import { redisSubscriber, redisClient } from "../redisClient";

export function reservationSubscriber() {
  redisSubscriber.subscribe("reservation-updated", (err, count) => {
    if (err) {
      console.error("❌ Failed to subscribe to reservation channel:", err);
      return;
    }
    console.log(`✅ Subscribed to ${count} channel(s).`);
  });

  redisSubscriber.on("message", async (channel, message) => {
    if (channel === "reservation-updated") {
      console.log("📢 Reservation update received:", message);
      const { type } = JSON.parse(message);

      const pattern =
        type === "business"
          ? "business-reservation:*"
          : "residential-reservation:*";
      const keys = await redisClient.keys(pattern);
      if (keys.length) {
        await redisClient.del(keys);
        console.log(
          `Cleared Redis cache keys [${pattern}] (${keys.length} keys)`
        );
      }
    }
  });
}
