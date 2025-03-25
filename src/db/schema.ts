import { sql } from "drizzle-orm";
import {
	integer,
	real,
	sqliteTableCreator,
	text,
} from "drizzle-orm/sqlite-core";

const createTable = sqliteTableCreator((name) => `dolary_${name}`);

const id = integer("id").primaryKey({ autoIncrement: true });
const createdAt = text("created_at")
	.notNull()
	.default(sql`(current_timestamp)`);
const updatedAt = text("updated_at")
	.notNull()
	.default(sql`(current_timestamp)`)
	.$onUpdate(() => new Date().toISOString());
const isActive = integer("is_active", { mode: "boolean" })
	.notNull()
	.default(true);

export const pageTable = createTable("page", {
	id,
	name: text("name").notNull(),
	url: text("url").notNull(),
	createdAt,
	updatedAt,
	isActive,
});

export const currencyTable = createTable("currency", {
	id,
	symbol: text("symbol").notNull(),
	createdAt,
	updatedAt,
	isActive,
});

export const monitorTable = createTable("monitor", {
	id,
	idPage: integer("id_page")
		.references(() => pageTable.id)
		.notNull(),
	idCurrency: integer("id_currency")
		.references(() => currencyTable.id)
		.notNull(),
	key: text("key"),
	title: text("title").notNull(),
	price: real("price").notNull(),
	priceOld: real("price_old"),
	lastUpdate: integer("last_update", { mode: "timestamp" }).notNull(),
	image: text("image"),
	percent: real("percent").default(0.0),
	change: real("change").default(0.0),
	color: text("color").default("neutral"),
	symbol: text("symbol").default(""),

	createdAt,
	updatedAt,
	isActive,
});
export type InsertMonitor = typeof monitorTable.$inferInsert;
export type UpdateMonitor = Omit<InsertMonitor, "createdAt" | "updatedAt">;

export const historyTable = createTable("history", {
	id,
	idMonitor: integer("id_monitor")
		.references(() => monitorTable.id)
		.notNull(),
	price: real("price").notNull(),
	lastUpdate: integer("last_update", { mode: "timestamp" }).notNull(),
	createdAt,
	updatedAt,
	isActive,
});
export type InsertHistory = typeof historyTable.$inferInsert;
