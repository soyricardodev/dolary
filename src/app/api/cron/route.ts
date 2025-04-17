import { UPDATE_SCHEDULE, VENEZUELAN_BANK_HOLIDAYS_2025 } from "../consts";
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
import { sendNotificationToAllUsers } from "@/components/notifications/actions";

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
	const monitorKey = `monitor:${rate}`;

	const [lastUpdateRedis, redisData] = await redis
		.pipeline()
		.get<Date>(updateKey)
		.get<Monitor>(monitorKey)
		.exec();

	try {
		if (!force && lastUpdateRedis) {
			const lastUpdateRedisTime = toZonedTime(
				new Date(lastUpdateRedis),
				TIME_ZONE,
			);
			const lastUpdateRedisDay = format(lastUpdateRedisTime, DAY_FORMAT, {
				timeZone: TIME_ZONE,
			});
			const tomorrow = format(
				toZonedTime(
					new Date(getVenezuelaTime().getTime() + 24 * 60 * 60 * 1000),
					TIME_ZONE,
				),
				DAY_FORMAT,
				{ timeZone: TIME_ZONE },
			);

			if (rate === "bcv") {
				if (lastUpdateRedisDay === tomorrow) {
					console.log("Skipping bcv update as it is updated.");
					return;
				}
				console.log("We need to update BCV");
			}

			if (rate === "paralelo") {
				const currentHour = getVenezuelaTime().getHours();
				const lastUpdateDay = format(lastUpdateRedisTime, DAY_FORMAT, {
					timeZone: TIME_ZONE,
				});
				const today = format(getVenezuelaTime(), DAY_FORMAT, {
					timeZone: TIME_ZONE,
				});

				if (lastUpdateDay === today && currentHour < 12) {
					console.log(
						"Skipping paralelo update as it was already updated today in the morning.",
					);
					return;
				}
			}
		}

		const data = rate === "paralelo" ? await getParalelo() : await getUsdBcv();
		if (!data || !data.last_update) {
			console.warn(`No data received for ${rate}.`);
			return;
		}

		const dateMatch = redisData?.last_update
			? new Date(data.last_update).toISOString() ===
				new Date(redisData.last_update).toISOString()
			: false;

		if (dateMatch && !force) {
			console.log("We don't have updated data for:", rate);
			return;
		}

		await db.transaction(async (tx) => {
			const [latestData] = await tx
				.select()
				.from(monitorTable)
				.where(eq(monitorTable.key, rate));

			if (!latestData) {
				console.warn(`No latest data found for ${rate}, using mockup data.`);
				return;
			}

			const lastUpdateDays = differenceInDays(
				new Date(),
				latestData.lastUpdate,
			);
			console.log(`Last updated ${lastUpdateDays} days ago`);

			if (
				!force &&
				UPDATE_SCHEDULE[rate].not.includes(
					format(toZonedTime(latestData.lastUpdate, TIME_ZONE), "EEEE", {
						timeZone: TIME_ZONE,
					}),
				)
			) {
				console.log(
					`Not updating ${rate} because last update was on a weekend.`,
				);
				return;
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
			let lastUpdate: Date;
			if (rate === "bcv") {
				lastUpdate = data.last_update ? new Date(data.last_update) : new Date();
			} else {
				lastUpdate = data.last_update ? new Date(data.last_update) : new Date();
			}
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

			await redis
				.pipeline()
				.set(updateKey, lastUpdate, { ex: 60 * 60 * 24 }) // Set TTL for 24 hours
				.set(monitorKey, dataToCache)
				.exec();

			const direction =
				change > 0 ? "subió" : change < 0 ? "bajó" : "se mantuvo igual";
			const notificationMessage = `La tasa ${rate.charAt(0).toUpperCase() + rate.slice(1)} ${direction} a ${price.toFixed(2)}. Cambio: ${symbol} ${sanitizedChange} (${percent}%).`;
			//await sendNotificationToAllUsers(notificationMessage);

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

export async function POST(req: NextRequest) {
	try {
		const { searchParams } = req.nextUrl;
		const forceUpdate = searchParams.get("force") === "true";

		const venezuelaTime = getVenezuelaTime();
		const day = format(venezuelaTime, "EEEE", { timeZone: TIME_ZONE });
		const time = format(venezuelaTime, TIME_FORMAT, { timeZone: TIME_ZONE });
		const todayDate = format(venezuelaTime, DAY_FORMAT, {
			timeZone: TIME_ZONE,
		});

		console.log(`API Route called at ${time} Venezuela time.`);

		const updates = [];

		if (forceUpdate || !UPDATE_SCHEDULE.paralelo.not.includes(day)) {
			updates.push(runUpdateWithLock("paralelo", forceUpdate));
		} else {
			console.log("Skipping paralelo due to day restriction.");
		}

		if (
			forceUpdate ||
			(!UPDATE_SCHEDULE.bcv.not.includes(day) &&
				!VENEZUELAN_BANK_HOLIDAYS_2025.includes(todayDate))
		) {
			updates.push(runUpdateWithLock("bcv", forceUpdate));
		} else {
			if (VENEZUELAN_BANK_HOLIDAYS_2025.includes(todayDate)) {
				console.log("Skipping bcv due to Venezuelan bank holiday.");
			} else {
				console.log("Skipping bcv due to day restriction.");
			}
		}

		await Promise.all(updates);

		return NextResponse.json({ message: "success" });
	} catch (error) {
		console.error("API Route Error:", error);
		return NextResponse.json({ error: "Failed to process updates." });
	}
}
