import { UPDATE_SCHEDULE, type UpdateSchedule } from "../consts";
import { toZonedTime, format } from "date-fns-tz";

import { getUsdBcv } from "../bcv/route";
import { getParalelo } from "../paralelo/route";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/db/db";
import { historyTable, monitorTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { differenceInDays } from "date-fns";

const TIME_ZONE = "America/Caracas";

const getVenezuelaTime = (): Date => {
	return toZonedTime(new Date(), TIME_ZONE);
};

const isWithinSchedule = (currency: UpdateSchedule, force = false): boolean => {
	if (force) {
		console.log("Forcing update, ignoring day and time checks.");
		return true;
	}

	const venezuelaTime = getVenezuelaTime();
	const day = format(venezuelaTime, "EEEE", { timeZone: TIME_ZONE });
	const hour = format(venezuelaTime, "HH:mm", { timeZone: TIME_ZONE });

	console.log("Current Venezuela Time:", venezuelaTime);
	console.log("Day:", day);
	console.log("Hour:", hour);

	if (!currency.not.includes(day)) {
		for (const [start, end] of currency.hours) {
			console.log({ start, end });
			if (hour >= start && hour <= end) {
				console.log("Is on schedule.");
				return true;
			}
		}
	}
	console.log("Not within schedule.");
	return false;
};

async function updateRate(rate: "paralelo" | "bcv", force = false) {
	console.log(`Updating ${rate}, force=${force}`);
	try {
		const data = rate === "paralelo" ? await getParalelo() : await getUsdBcv();

		if (!data) {
			console.warn(`No data received for ${rate}.`);
			return;
		}

		await db.transaction(async (tx) => {
			const [latestData] = await tx
				.select()
				.from(monitorTable)
				.where(eq(monitorTable.key, rate));

			if (!latestData) {
				console.warn(`No latest data found for ${rate}, skipping update.`);
				return;
			}

			const lastUpdateDays = differenceInDays(
				new Date(),
				latestData.lastUpdate,
			);
			console.log(`Last updated ${lastUpdateDays} days ago`);

			let shouldForceUpdate = force;
			if (
				lastUpdateDays > Number(process.env.STALE_DATA_THRESHOLD_DAYS || 1) &&
				!shouldForceUpdate
			) {
				console.log(`Data for ${rate} is stale, forcing update.`);
				shouldForceUpdate = true;
			}
			if (!shouldForceUpdate) {
				if (!force) {
					const lastUpdateVenezuelaTime = toZonedTime(
						latestData.lastUpdate,
						TIME_ZONE,
					);
					const lastUpdateDay = format(lastUpdateVenezuelaTime, "EEEE", {
						timeZone: TIME_ZONE,
					});

					if (UPDATE_SCHEDULE[rate].not.includes(lastUpdateDay)) {
						console.log(
							`Not updating ${rate} because last update was on a weekend.`,
						);
						return;
					}
				}
			}

			const change = Number.parseFloat(
				(data.price - latestData.price).toFixed(2),
			);
			const percent = Number.parseFloat(
				((change / data.price) * 100 || 0).toFixed(2).replace("-", ""),
			);
			const color =
				data.price < latestData.price
					? "red"
					: data.price > latestData.price
						? "green"
						: "neutral";
			const symbol = color === "green" ? "▲" : color === "red" ? "▼" : "";
			const lastUpdate = data.last_update
				? new Date(data.last_update)
				: new Date();
			const sanitizedChange = Number.parseFloat(
				change.toString().replace("-", ""),
			);

			await tx
				.update(monitorTable)
				.set({
					price: data.price,
					priceOld: latestData.price,
					change: sanitizedChange,
					symbol,
					lastUpdate,
					color,
					percent,
				})
				.where(eq(monitorTable.key, rate));

			await tx.insert(historyTable).values({
				idMonitor: latestData.id,
				lastUpdate,
				price: data.price,
			});

			console.log(`Successfully updated ${rate}.`);
		});
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(`Failed to update ${rate}:`, error.message);
		} else {
			console.error(`Failed to update ${rate}:`, error);
		}
	}
}

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = req.nextUrl;
		const forceUpdate = searchParams.get("force") === "true";

		const updates = [];

		if (isWithinSchedule(UPDATE_SCHEDULE.paralelo, forceUpdate)) {
			updates.push(updateRate("paralelo", forceUpdate));
		}
		if (isWithinSchedule(UPDATE_SCHEDULE.bcv, forceUpdate)) {
			updates.push(updateRate("bcv", forceUpdate));
		}

		await Promise.all(updates);

		return NextResponse.json({ message: "success" });
	} catch (error) {
		console.error("API Route Error:", error);
		return NextResponse.json({ error: "Failed to process updates." });
	}
}
