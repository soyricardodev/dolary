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

	useEffect(() => {
		const checkForUpdates = () => {
			if (shouldRefetch()) {
				queryClient.invalidateQueries({ queryKey: ["rates"] });
			}
		};

		// Check every 5 minutes
		const intervalId = setInterval(checkForUpdates, 5 * 60 * 1000);

		checkForUpdates();

		return () => clearInterval(intervalId);
	}, [queryClient]);

	return useQuery({
		queryKey: ["rates"],
		queryFn: async () => {
			try {
				const data = await getDolarRates();

				saveToCache(data);

				return data;
			} catch (error) {
				const { data } = getFromCache();
				if (data) {
					return data;
				}
				throw error;
			}
		},
		staleTime: 30 * 60 * 1000, // 30 minutes
		gcTime: 24 * 60 * 60 * 1000, // 24 hours
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: true,
	});
}
