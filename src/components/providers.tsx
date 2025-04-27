"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "./theme-provider";
import {
	defaultShouldDehydrateQuery,
	isServer,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "./ui/sonner";
import { CalculatorProvider } from "@/context/calculator-context";

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000, // 1 minute
				gcTime: 10 * 60 * 1000, // 10 minutes
				refetchOnWindowFocus: true,
				retry: 1,
				refetchOnMount: true,
				refetchOnReconnect: true,
			},
			dehydrate: {
				// include pending queries in dehydration
				shouldDehydrateQuery: (query) =>
					defaultShouldDehydrateQuery(query) ||
					query.state.status === "pending",
				shouldRedactErrors: () => {
					// We should not catch Next.js server errors
					// as that's how Next.js detects dynamic pages
					// so we cannot redact them.
					// Next.js also automatically redacts errors for us
					// with better digests.
					return false;
				},
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
	if (isServer) {
		// Server: always make a new query client
		return makeQueryClient();
	}
	// Browser: make a new query client if we don't already have one
	// This is very important, so we don't re-make a new client if React
	// suspends during the initial render. This may not be needed if we
	// have a suspense boundary BELOW the creation of the query client
	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
}

export function Providers({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				<CalculatorProvider>
					<Toaster />
					{children}
				</CalculatorProvider>
			</ThemeProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
