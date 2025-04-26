"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getDolarRates } from "@/queries";
import useLocalStorage from "./use-local-storage";
import type { RatesResponse } from "@/types";

const CURRENCY_DATA_STORAGE_KEY = "currencyData";

// Extended type to include timestamp
interface StoredData {
	data: RatesResponse;
	timestamp: number;
}

// Define the meta type
export interface OfflineMeta {
	offline: boolean;
	lastUpdated: string;
	timeSinceUpdate: number;
}

// Define a type for the query result with meta
interface QueryWithMeta {
	data: RatesResponse;
	isLoading: boolean;
	isFetching: boolean;
	status: string;
	meta?: OfflineMeta;
	[key: string]: unknown; // Allow other properties from the original query
}

export function useCurrencyData() {
	const [isOnline, setIsOnline] = useState(true);
	const queryClient = useQueryClient();
	const [storedData, setStoredData] = useLocalStorage<StoredData | undefined>(
		CURRENCY_DATA_STORAGE_KEY,
		undefined,
	);

	// Track online status
	useEffect(() => {
		setIsOnline(navigator.onLine);

		const handleOnline = () => {
			setIsOnline(true);
			// Invalidate queries when coming back online to ensure fresh data
			queryClient.invalidateQueries({ queryKey: ["rates"] });
		};

		const handleOffline = () => setIsOnline(false);

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, [queryClient]);

	const query = useQuery({
		queryKey: ["rates"],
		queryFn: async () => {
			try {
				const data = await getDolarRates();
				return data;
			} catch (error) {
				// If we're offline and have stored data, return it
				if (!isOnline && storedData) {
					return storedData.data;
				}

				// Otherwise throw the error
				throw error;
			}
		},
		staleTime: 60 * 1000, // 1 minute
		gcTime: 10 * 60 * 1000, // 10 minutes
		refetchOnWindowFocus: isOnline, // Only refetch on focus if online
		refetchOnMount: isOnline, // Only refetch on mount if online
		refetchOnReconnect: true, // Always refetch when reconnecting
		// Don't retry if offline
		retry: isOnline ? 3 : 0,
		// Use placeholder data while loading if available
		placeholderData: (oldData) => oldData,
	});

	// Store the latest data in localStorage whenever it changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: If we set the setStoredData here, it will cause a re-render of the component and infinite loop
	useEffect(() => {
		if (query.data) {
			setStoredData({
				data: query.data,
				timestamp: Date.now(),
			});
		}
	}, [query.data]);

	// If offline and we have stored data, use it
	if (!isOnline && !query.data && storedData) {
		// Create a modified query result with offline metadata
		const offlineQuery: QueryWithMeta = {
			...query,
			data: storedData.data,
			isLoading: false,
			isFetching: false,
			status: "success",
			meta: {
				offline: true,
				lastUpdated: new Date(storedData.timestamp).toLocaleString(),
				timeSinceUpdate: Math.floor(
					(Date.now() - storedData.timestamp) / 1000 / 60,
				), // minutes
			},
		};

		return offlineQuery;
	}

	return query;
}
