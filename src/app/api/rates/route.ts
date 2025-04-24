import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import type { Monitor } from "../types";

export const revalidate = 300;

const redis = Redis.fromEnv();

export async function GET() {
	const bcvData = redis.get<Monitor>("monitor:bcv");
	const paraleloData = redis.get<Monitor>("monitor:paralelo");
	const euroData = redis.get<Monitor>("monitor:eur");

	const [bcv, paralelo, euro] = await Promise.all([
		bcvData,
		paraleloData,
		euroData,
	]);

	return NextResponse.json({
		data: {
			bcv,
			paralelo,
			eur: euro,
		},
	});
}
