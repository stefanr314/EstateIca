import { redisSubscriber, redisClient } from "../redisClient";

export function estateSubscriber() {
  redisSubscriber.subscribe("estate-updated", (err, count) => {
    if (err) {
      console.error("❌ Failed to subscribe to estate channel:", err);
      return;
    }
    console.log(`✅ Subscribed to ${count} channel(s).`);
  });

  redisSubscriber.on("message", async (channel, message) => {
    if (channel === "estate-updated") {
      console.log("📢 Estate update received:", message);
      const { type } = JSON.parse(message);

      const pattern = type === "business" ? "business:*" : "residential:*";
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
