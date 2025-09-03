import { RedisOptions } from "ioredis";
import "dotenv/config";

const connection: RedisOptions = {
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
};
export default connection;
