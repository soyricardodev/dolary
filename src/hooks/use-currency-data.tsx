"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { shouldRefetch } from "@/lib/utils";
import type { RatesResponse } from "@/types";
import { getDolarRates } from "@/queries";

const CURRENCY_CACHE_KEY = "currency_data_cache";
const CACHE_TIMESTAMP_KEY = "currency_cache_timestamp";

const saveToCache = (data: RatesResponse) => {
	try {
		localStorage.setItem(CURRENCY_CACHE_KEY, JSON.stringify(data));
		localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
	} catch (error) {
		console.error("Error saving to cache:", error);
	}
};

const getFromCache = (): {
	data: RatesResponse | null;
	timestamp: number;
} => {
	try {
		const cachedData = localStorage.getItem(CURRENCY_CACHE_KEY);
		const timestamp = Number(localStorage.getItem(CACHE_TIMESTAMP_KEY) || "0");

		if (cachedData) {
			return { data: JSON.parse(cachedData), timestamp };
		}
	} catch (error) {
		console.error("Error reading from cache:", error);
	}

	return { data: null, timestamp: 0 };
};

export function useCurrencyData() {
	return useQuery({
		queryKey: ["rates"],
		queryFn: () => getDolarRates(),
		staleTime: 60 * 1000, // 1 minute
		gcTime: 10 * 60 * 1000, // 10 minutes
		refetchOnWindowFocus: true,
		refetchOnMount: true,
		refetchOnReconnect: true,
	});
}
