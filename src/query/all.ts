import { useQuery } from "@tanstack/react-query";

export interface Currency {
	name: string;
	value: number;
}

export interface AllCurrencies {
	data: Currency[];
}

export type Currencies =
	| "paralelo"
	| "bcv"
	| "eur"
	| "yuan"
	| "lira"
	| "rublo"
	| "usd";

export function allCurrenciesQuery() {
	return useQuery({
		queryKey: ["all"],
		queryFn: async () =>
			await fetch("/api/all").then(
				(res) => res.json() as Promise<AllCurrencies>,
			),
	});
}
