import { UPDATE_SCHEDULE, VENEZUELAN_BANK_HOLIDAYS_2025 } from "../consts";
import { toZonedTime, format } from "date-fns-tz";
import { getBcv } from "../_bcv/route";
import { getParalelo } from "../_paralelo/route";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/db/db";
import { historyTable, monitorTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Redis } from "@upstash/redis";
import type { Monitor, Rate } from "../types";
import { sendNotificationToAllUsers } from "@/components/notifications/actions";
import { revalidateTag } from "next/cache";
import { QueryClient } from "@tanstack/react-query";

const redis = Redis.fromEnv();

const TIME_ZONE = "America/Caracas";

const getVenezuelaTime = (): Date => {
	return toZonedTime(new Date(), TIME_ZONE);
};

const DAY_FORMAT = "yyyy-MM-dd";
const TIME_FORMAT = "HH:mm";

async function updateRate(rate: "paralelo" | "bcv" | "eur", force = false) {
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

			if (rate === "bcv" || rate === "eur") {
				if (lastUpdateRedisDay === tomorrow) {
					console.log(`Skipping ${rate} update as it is updated.`);
					return;
				}
				console.log(`We need to update ${rate}`);
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

		let data: Rate | null = null;
		let eurData: Rate | null = null;

		if (rate === "paralelo") {
			data = await getParalelo();
		} else if (rate === "bcv") {
			// BCV is the source of truth for both USD and EUR rates
			const bcvData = await getBcv();
			data = bcvData.find((r) => r.key === "usd") ?? null;
			eurData = bcvData.find((r) => r.key === "eur") ?? null;
		}
		// We don't need to handle rate === "eur" separately since it's handled with BCV data

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

		// Update the requested rate
		await updateRateInDb(rate, data);

		// If we're updating BCV and have EUR data, update EUR as well
		if (rate === "bcv" && eurData && eurData.last_update) {
			await updateRateInDb("eur", eurData);
		}
	} catch (error) {
		console.error(`Error updating ${rate}:`, error);
	}
}

async function updateRateInDb(rate: "paralelo" | "bcv" | "eur", data: Rate) {
	const monitorKey = `monitor:${rate}`;
	const updateKey = `update:${rate}`;

	await db.transaction(async (tx) => {
		const [latestData] = await tx
			.select()
			.from(monitorTable)
			.where(eq(monitorTable.key, rate));

		if (!latestData) {
			console.warn(`No latest data found for ${rate}`);
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
		const lastUpdate = data.last_update
			? new Date(data.last_update)
			: new Date();

		await tx
			.update(monitorTable)
			.set({
				price,
				priceOld,
				change,
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
			change,
			symbol,
			last_update: lastUpdate,
			color,
			percent,
		};

		await redis
			.pipeline()
			.set(updateKey, lastUpdate)
			.set(monitorKey, dataToCache)
			.exec();

		// Only send notifications for USD BCV and USD Paralelo rates
		if (rate === "bcv" || rate === "paralelo") {
			const direction =
				change > 0 ? "subió" : change < 0 ? "bajó" : "se mantuvo igual";
			const notificationMessage = `La tasa ${rate} ${direction} a ${price.toFixed(2)}. Cambio: ${symbol} ${change} (${percent}%).`;
			await sendNotificationToAllUsers(notificationMessage);
		}
	});
}

async function runUpdateWithLock(
	rate: "paralelo" | "bcv" | "eur",
	forceUpdate: boolean,
) {
	const queryClient = new QueryClient();
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
		revalidateTag("rates");
		queryClient.invalidateQueries({ queryKey: ["rates"] });

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
			// Also update Euro data when updating BCV data
			updates.push(runUpdateWithLock("eur", forceUpdate));
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
