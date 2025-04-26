"use client";

import { WifiOffIcon } from "lucide-react";
import { useCurrencyData } from "@/hooks/use-currency-data";
import type { OfflineMeta } from "@/hooks/use-currency-data";

// Define a type for the query result with meta
interface QueryWithMeta {
	data: unknown;
	meta?: OfflineMeta;
	[key: string]: unknown;
}

export function OfflineIndicator() {
	const query = useCurrencyData();

	// Only show if we're using offline data
	const meta = (query as QueryWithMeta).meta;
	if (!meta?.offline) return null;

	return (
		<div className="fixed bottom-4 right-4 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-4 py-2 rounded-md shadow-md flex items-center gap-2 z-50">
			<WifiOffIcon className="h-4 w-4" />
			<div className="text-sm">
				<div>Offline Mode</div>
				<div className="text-xs opacity-80">
					Last updated: {meta.lastUpdated} ({meta.timeSinceUpdate} min ago)
				</div>
			</div>
		</div>
	);
}
