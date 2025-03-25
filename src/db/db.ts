import { type Client, createClient, type Config } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
	client: Client | undefined;
};

const config = {
	url: process.env.DATABASE_URL ?? "./db.sqlite",
	authToken: process.env.DATABASE_TOKEN,
} satisfies Config;

export const client = globalForDb.client ?? createClient(config);
if (process.env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });
