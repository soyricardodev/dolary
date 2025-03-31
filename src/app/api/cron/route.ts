import { UPDATE_SCHEDULE } from "../consts";
import { toZonedTime, format } from "date-fns-tz";
import { getUsdBcv } from "../bcv/route";
import { getParalelo } from "../paralelo/route";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db/db";
import { historyTable, monitorTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { differenceInDays } from "date-fns";
import { Redis } from "@upstash/redis";
import type { Monitor } from "../types";

const redis = Redis.fromEnv();

const TIME_ZONE = "America/Caracas";

const getVenezuelaTime = (): Date => {
	return toZonedTime(new Date(), TIME_ZONE);
};

const DAY_FORMAT = "yyyy-MM-dd";
const TIME_FORMAT = "HH:mm";

async function updateRate(rate: "paralelo" | "bcv", force = false) {
	console.log(`Updating ${rate}, force=${force}`);
	const updateKey = `update:${rate}`;

	try {
		const lastUpdateRedis = await redis.get<Date>(updateKey);

		if (!force && lastUpdateRedis) {
			const lastUpdateRedisTime = toZonedTime(
				new Date(lastUpdateRedis),
				TIME_ZONE,
			);
			const lastUpdateRedisDay = format(lastUpdateRedisTime, DAY_FORMAT, {
				timeZone: TIME_ZONE,
			});
			const currentDay = format(getVenezuelaTime(), DAY_FORMAT, {
				timeZone: TIME_ZONE,
			});

			if (lastUpdateRedisDay === currentDay) {
				if (rate === "bcv") {
					console.log("Skipping bcv update as it was already updated today.");
					return;
				}

				const hoursSinceLastUpdate =
					(getVenezuelaTime().getTime() - lastUpdateRedisTime.getTime()) /
					(1000 * 60 * 60);

				if (hoursSinceLastUpdate < 2) {
					console.log(
						"Skipping paralelo update as it was already updated less than 2 hours ago.",
					);
					return;
				}
			}
		}

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

			const price = data.price;
			const priceOld = latestData.price;
			const change = Number.parseFloat((price - priceOld).toFixed(2));
			const percent = Number.parseFloat(
				((change / price) * 100 || 0).toFixed(2).replace("-", ""),
			);
			const color =
				price < priceOld ? "red" : price > priceOld ? "green" : "neutral";
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
					price,
					priceOld,
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
				price,
			});

			redis.pipeline().set(updateKey, lastUpdate).exec();

			const dataToCache: Monitor = {
				key: rate,
				title: rate,
				price,
				price_old: priceOld,
				change: sanitizedChange,
				symbol,
				last_update: lastUpdate,
				color,
				percent,
			} satisfies Monitor;

			await redis.set(`monitor:${rate}`, dataToCache);

			console.log(`Successfully updated ${rate}.`);
		});
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		console.error(`Failed to update ${rate}:`, errorMessage);
	}
}

async function runUpdateWithLock(
	rate: "paralelo" | "bcv",
	forceUpdate: boolean,
) {
	const updaterId = `updater:${Date.now()}`;
	const lockKey = `update:rate:${rate}`;

	const existingUpdater = await redis.get(lockKey);

	if (existingUpdater) {
		console.log(
			`Another update process is already running for ${rate}. Skipping update.`,
		);
		return false;
	}

	try {
		await redis
			.pipeline()
			.set(lockKey, updaterId)
			.expire(lockKey, 60 * 5) // Set a 5-minute expiration
			.exec();
		await updateRate(rate, forceUpdate);
		console.log(`Updated ${rate}.`);
		return true;
	} finally {
		const currentUpdater = await redis.get(lockKey);
		if (currentUpdater === updaterId) {
			await redis.del(lockKey);
		}
	}
}

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = req.nextUrl;
		const forceUpdate = searchParams.get("force") === "true";

		const venezuelaTime = getVenezuelaTime();
		const day = format(venezuelaTime, "EEEE", { timeZone: TIME_ZONE });
		const time = format(venezuelaTime, TIME_FORMAT, { timeZone: TIME_ZONE });

		console.log(`API Route called at ${time} Venezuela time.`);

		const updates = [];

		if (!UPDATE_SCHEDULE.paralelo.not.includes(day)) {
			updates.push(runUpdateWithLock("paralelo", forceUpdate));
		} else {
			console.log("Skipping paralelo due to day restriction.");
		}

		if (!UPDATE_SCHEDULE.bcv.not.includes(day)) {
			updates.push(runUpdateWithLock("bcv", forceUpdate));
		} else {
			console.log("Skipping bcv due to day restriction.");
		}

		await Promise.all(updates);

		return NextResponse.json({ message: "success" });
	} catch (error) {
		console.error("API Route Error:", error);
		return NextResponse.json({ error: "Failed to process updates." });
	}
}
