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
	const response = await fetch("/api/rates", {
		next: {
			revalidate: 1800,
			tags: ["rates"],
		},
	});

	if (!response.ok) {
		throw new Error("Network response was not ok");
	}

	const data = (await response.json()) as RatesResponse;

	return data;
};
