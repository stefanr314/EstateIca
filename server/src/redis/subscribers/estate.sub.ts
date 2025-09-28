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
    if (channel !== "estate-updated") return;

    try {
      const { type, scope, hostId } = JSON.parse(message);

      if (scope === "global") {
        // briše globalne cache-ove za listinge
        const pattern =
          type === "business"
            ? "business:*"
            : type === "residential"
            ? "residential:*"
            : null;

        if (pattern) {
          const keys = await redisClient.keys(pattern);
          if (keys.length) {
            await redisClient.del(keys);
            console.log(
              `🗑️ Cleared Redis cache [${pattern}] (${keys.length} keys)`
            );
          }
        }
      }

      if (scope === "personal" && hostId) {
        // briše cache-ove za određenog hosta
        const pattern = `personal:${hostId}:*`;
        const keys = await redisClient.keys(pattern);
        if (keys.length) {
          await redisClient.del(keys);
          console.log(
            `🗑️ Cleared Redis personal cache for host ${hostId} (${keys.length} keys)`
          );
        }
      }
    } catch (err) {
      console.error("❌ Failed to process estate-updated message:", err);
    }
  });
}
