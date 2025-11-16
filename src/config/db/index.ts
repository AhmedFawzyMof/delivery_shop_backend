import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema.js";
import "dotenv/config";

if (!process.env.DB_URL) {
  throw new Error("no DB_URL in env");
}

const client = createClient({
  url: process.env.DB_URL,
});

// Turso Connection ->
// const client = createClient({
//   url: process.env.TURSO_DB_URL!,
//   authToken: process.env.TURSO_DB_TOKEN!,
// });

export const db = drizzle(client, { schema });
