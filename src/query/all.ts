import { useQuery } from "@tanstack/react-query";

export interface Currency {
	label: string;
	name: string;
	value: number;
	currency: "USD" | "EUR" | "CNY";
	color: string;
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
