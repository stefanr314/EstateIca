import Redis from "ioredis";

export const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME,
});

export const redisSubscriber = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME,
});

redisClient.on("connect", () => {
  logging.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  logging.error("Redis error:", err);
});

redisSubscriber.on("error", (err) => {
  logging.error("Redis subscriber error:", err);
});
