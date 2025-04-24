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
	const queryClient = useQueryClient();

	return useQuery({
		queryKey: ["rates"],
		queryFn: async () => {
			try {
				// Clear any stale data from localStorage when fetching fresh data
				const { timestamp } = getFromCache();
				const now = Date.now();
				const isStale = now - timestamp > 5 * 60 * 1000; // 5 minutes

				// If cache is stale, clear it before fetching
				if (isStale) {
					try {
						localStorage.removeItem(CURRENCY_CACHE_KEY);
						localStorage.removeItem(CACHE_TIMESTAMP_KEY);
					} catch (error) {
						console.error("Error clearing stale cache:", error);
					}
				}

				const data = await getDolarRates();

				console.log("data useCurrencyData", data);

				// Only save to cache if the fetch was successful
				saveToCache(data);

				return data;
			} catch (error) {
				console.error("Error fetching rates:", error);

				// Only use cache as fallback if it's not too old
				const { data: cachedData, timestamp } = getFromCache();
				const now = Date.now();
				const isCacheValid = now - timestamp < 30 * 60 * 1000; // 30 minutes

				if (cachedData && isCacheValid) {
					console.log("Using cached data as fallback");
					console.log("cachedData useCurrencyData", cachedData);
					return cachedData;
				}

				throw error;
			}
		},
		staleTime: 5 * 60 * 1000, // 5 minutes
		gcTime: 10 * 60 * 1000, // 10 minutes
		refetchOnWindowFocus: true,
		refetchOnMount: true,
		refetchOnReconnect: true,
	});
}
