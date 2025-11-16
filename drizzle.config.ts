import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DB_URL) {
  throw new Error("no DB_URL in env");
}

export default defineConfig({
  schema: "./src/config/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DB_URL,
  },
});
