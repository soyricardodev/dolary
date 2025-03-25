import { and, eq, sql } from "drizzle-orm";
import { db } from "./db";
import {
	pageTable,
	currencyTable,
	historyTable,
	monitorTable,
	type InsertMonitor,
	type UpdateMonitor,
	type InsertHistory,
	lower,
} from "./schema";

export async function createPage(pageName: string, pageUrl: string) {
	const [newPage] = await db
		.insert(pageTable)
		.values({
			name: pageName,
			url: pageUrl,
		})
		.returning({ id: pageTable.id });

	return newPage.id;
}

export async function createCurrency(symbol: string) {
	const [newCurrency] = await db
		.insert(currencyTable)
		.values({ symbol })
		.returning({ id: currencyTable.id });
	return newCurrency.id;
}

export async function getMonitors(pageId: number, currencyId: number) {
	const monitors = await db
		.select()
		.from(monitorTable)
		.where(
			and(
				eq(monitorTable.idPage, pageId),
				eq(monitorTable.idCurrency, currencyId),
			),
		);

	return monitors;
}

export async function getMonitorById(monitorId: number) {
	const [monitor] = await db
		.select()
		.from(monitorTable)
		.where(eq(monitorTable.id, monitorId));

	return monitor;
}

export async function getMonitorByKey(key: string) {
	const [monitor] = await db
		.select()
		.from(monitorTable)
		.where(eq(monitorTable.key, key));

	return monitor;
}

export async function getUniqueMonitorsIds() {
	const ids = await db
		.selectDistinct({ id: monitorTable.id })
		.from(monitorTable);

	return ids;
}

export async function createMonitor(input: InsertMonitor) {
	const [newCurrency] = await db
		.insert(monitorTable)
		.values(input)
		.returning({ id: currencyTable.id });
	return newCurrency.id;
}

export async function createMonitors(input: InsertMonitor[]) {
	await db.insert(monitorTable).values(input);
}

export async function updateMonitor(input: UpdateMonitor) {
	const change = Math.round(
		Math.floor(input.price ?? 0) - Math.floor(input.priceOld ?? 0),
	);
	const percent = Number.parseFloat(
		`${Math.round((change / (input.price ?? 1)) * 100 || 0)}`.replace("-", " "),
	);

	const color =
		(input.price ?? 0) < (input.priceOld ?? 0)
			? "red"
			: (input.price ?? 0) > (input.priceOld ?? 0)
				? "green"
				: "neutral";

	const symbol = color === "green" ? "▲" : color === "red" ? "▼" : "=";
	const changeToInsert = Number.parseFloat(`${change}`.replace("-", ""));

	const [updatedMonitor] = await db
		.update(monitorTable)
		.set({
			...input,
			change: changeToInsert,
			percent,
			color,
			symbol,
		})
		.where(
			and(
				eq(monitorTable.id, input.id ?? 0),
				eq(monitorTable.idPage, input.idPage),
				eq(monitorTable.idCurrency, input.idCurrency),
			),
		)
		.returning({
			id: monitorTable.id,
			price: monitorTable.price,
			lastUpdate: monitorTable.lastUpdate,
		});

	addHistoryPrice({
		idMonitor: updatedMonitor.id,
		price: updatedMonitor.price,
		lastUpdate: updatedMonitor.lastUpdate,
	});

	return updatedMonitor.id;
}

export async function addHistoryPrice(input: InsertHistory) {
	await db.insert(historyTable).values(input);
}

export async function isExistPage(name: string) {
	const [page] = await db
		.select({ id: pageTable.id })
		.from(pageTable)
		.where(eq(lower(pageTable.name), name.toLowerCase()))
		.limit(1);

	if (!page) return null;
	return page;
}

export async function isExistCurrency(symbol: string) {
	const [currency] = await db
		.select({ id: currencyTable.id })
		.from(currencyTable)
		.where(eq(lower(currencyTable.symbol), symbol.toLowerCase()))
		.limit(1);
	if (!currency) return null;
	return currency;
}

export async function isExistMonitor(
	pageId: number,
	currencyId: number,
): Promise<boolean> {
	const count = await db
		.select({ count: sql<number>`COUNT(*)` })
		.from(monitorTable)
		.where(
			and(
				eq(monitorTable.idPage, pageId),
				eq(monitorTable.idCurrency, currencyId),
			),
		)
		.limit(1);

	return count.length > 0 && count[0].count > 0;
}
export async function isMonitorExists(
	pageId: number,
	currencyId: number,
): Promise<boolean> {
	const count = await db
		.select({ count: sql<number>`COUNT(*)` })
		.from(monitorTable)
		.where(
			and(
				eq(monitorTable.idPage, pageId),
				eq(monitorTable.idCurrency, currencyId),
			),
		)
		.limit(1);

	return count.length > 0 && count[0].count > 0;
}
