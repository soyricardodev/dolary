"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "./theme-provider";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 30 * 60 * 1000, // 30 minutes
			gcTime: 24 * 60 * 60 * 1000, // 24 hours
			refetchOnWindowFocus: true,
			retry: 3,
		},
	},
});

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				{children}
			</ThemeProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	);
}
