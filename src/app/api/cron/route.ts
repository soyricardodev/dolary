import { UPDATE_SCHEDULE } from "../consts";
import { toZonedTime, format } from "date-fns-tz";
import { getUsdBcv } from "../bcv/route";
import { getParalelo } from "../paralelo/route";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db/db";
import { historyTable, monitorTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { differenceInDays } from "date-fns";

const TIME_ZONE = "America/Caracas";

const getVenezuelaTime = (): Date => {
	return toZonedTime(new Date(), TIME_ZONE);
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
		console.error(`Failed to update ${rate}:`, error);
	}
}

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = req.nextUrl;
		const forceUpdate = searchParams.get("force") === "true";

		const venezuelaTime = getVenezuelaTime();
		const day = format(venezuelaTime, "EEEE", { timeZone: TIME_ZONE });

		console.log(
			`API Route called at ${format(venezuelaTime, "HH:mm", { timeZone: TIME_ZONE })} Venezuela time.`,
		);

		// Directly check if the current day is in the 'not' array for each currency
		const shouldUpdateParalelo = !UPDATE_SCHEDULE.paralelo.not.includes(day);
		const shouldUpdateBcv = !UPDATE_SCHEDULE.bcv.not.includes(day);

		if (shouldUpdateParalelo) {
			await updateRate("paralelo", forceUpdate);
			console.log("Updated paralelo.");
		} else {
			console.log("Skipping paralelo due to day restriction.");
		}

		if (shouldUpdateBcv) {
			await updateRate("bcv", forceUpdate);
			console.log("Updated bcv.");
		} else {
			console.log("Skipping bcv due to day restriction.");
		}

		return NextResponse.json({ message: "success" });
	} catch (error) {
		console.error("API Route Error:", error);
		return NextResponse.json({ error: "Failed to process updates." });
	}
}
