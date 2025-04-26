import { getRates } from "./features/rates/queries";
import type { RatesResponse } from "./types";

// export const getDolarRates = unstable_cache(
// 	async () => {
// 		const response = await fetch(
// 			"https://pydolarve.org/api/v1/dollar?rounded_price=false",
// 			{
// 				next: {
// 					revalidate: 900,
// 				},
// 			},
// 		);

// 		if (!response.ok) {
// 			throw new Error("Network response was not ok");
// 		}

// 		const data = (await response.json()) as DolarApiResponse;

// 		return data;
// 	},
// 	["rates"],
// 	{ revalidate: 900, tags: ["rates"] },
// );

export const getDolarRates = async () => {
	const response = await fetch(`${url}/api/rates`, {
		next: {
			tags: ["rates"],
			revalidate: 60,
		},
	});

	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	const data = (await response.json()) as RatesResponse;

	return data;
};

export const prefetchRates = async (): Promise<RatesResponse> => {
	const { data } = await getRates();

	console.log("prefetchRates", data);

	return { data };
};
const url =
	process.env.NODE_ENV === "production"
		? "https://dolary.vercel.app"
		: "http://localhost:3000";

// export const getDolarRates = unstable_cache(
// 	async () => {
// 		const response = await fetch(`${url}/api/rates`, {
// 			next: {
// 				revalidate: 1800,
// 			},
// 		});

// 		if (!response.ok) {
// 			throw new Error("Network response was not ok");
// 		}

// 		const data = (await response.json()) as RatesResponse;

// 		return data;
// 	},
// 	["rates"],
// 	{ revalidate: 900, tags: ["rates"] },
// );
