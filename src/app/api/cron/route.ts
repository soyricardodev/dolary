import { NextResponse } from "next/server";
import { getBcv } from "../bcv/route";
import { PROVIDERS, UPDATE_SCHEDULE } from "../consts";
import { getParalelo } from "../paralelo/route";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

async function updateData(name: "bcv" | "paralelo") {
	if (name === "bcv") {
		const data = await getBcv();
		await redis.set(name, data);
	}

	if (name === "paralelo") {
		const data = await getParalelo();
		await redis.set(name, data);
	}
}

export async function updateAllData() {
	const data = await getBcv();
	await redis.set("bcv", data);
	const test = await redis.get("bcv");
	console.log({ test });

	const paraleloData = await getParalelo();
	await redis.set("paralelo", paraleloData);
}

import { DateTime } from "luxon";

export async function GET() {
	try {
		const dt = DateTime.now().setZone("America/Caracas");
		const dayOfWeek = dt.toFormat("ccc");
		const currentTime = dt.toFormat("HH:mm");

		for (const monitor of Object.values(PROVIDERS)) {
			const providerName = monitor.id as "paralelo" | "bcv";

			// Check if a schedule is defined for this provider
			if (!(providerName in UPDATE_SCHEDULE)) {
				console.log(
					`Skipping update for "${providerName}" (no schedule defined).`,
				);
				continue;
			}

			const schedule = UPDATE_SCHEDULE[providerName];

			// Check if today is a day to perform updates
			if (schedule.not?.includes(dayOfWeek)) {
				console.info(`Skipping update for "${providerName}" on ${dayOfWeek}.`);
				continue;
			}

			if (schedule.hours && schedule.hours.length > 0) {
				let shouldUpdate = false;
				for (const [start, end] of schedule.hours) {
					if (currentTime >= start && currentTime <= end) {
						shouldUpdate = true;
						break;
					}
				}

				if (shouldUpdate) {
					console.info(
						`Updating data for "${providerName}" at ${currentTime}.`,
					);
					await updateData(providerName);
				} else {
					console.info(
						`Skipping update for "${providerName}" at ${currentTime} (outside scheduled hours).`,
					);
				}
			} else {
				console.info(
					`Updating data for "${providerName}" (no specific hours defined, updating on allowed days).`,
				);
				await updateData(providerName);
			}
		}

		// await sendWebhooks();
		return NextResponse.json({ message: "Update succesfully" });
	} catch (error) {
		console.error(`Error updating monitors: ${error}`);
		return NextResponse.error();
	}
}
