import { MongoClientOptions } from "mongodb";
import { MONGODB_URL } from "../config/config";

// index.ts in this example
import { mongoMigrateCli } from "mongo-migrate-ts";

mongoMigrateCli({
  uri: MONGODB_URL,
  database: "test",
  migrationsDir: __dirname,
  migrationsCollection: "migrations_collection",
});
