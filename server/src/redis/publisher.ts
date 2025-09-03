import { redisClient } from "./redisClient";

export async function publishMessage(channel: string, message: any) {
  await redisClient.publish(channel, JSON.stringify(message));
}
