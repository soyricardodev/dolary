import type { Monitor } from "@/app/api/types";
import type { RatesResponse } from "@/types";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function getRates(): Promise<RatesResponse> {
	const bcvData = redis.get<Monitor>("monitor:bcv");
	const paraleloData = redis.get<Monitor>("monitor:paralelo");
	const euroData = redis.get<Monitor>("monitor:eur");

	const [bcv, paralelo, euro] = await Promise.all([
		bcvData,
		paraleloData,
		euroData,
	]);

	if (!bcv || !paralelo) {
		throw new Error("Required rate data is missing");
	}

	return {
		data: {
			bcv,
			paralelo,
			euro: euro ?? undefined,
		},
	};
}
