import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { prefetchRates } from "@/queries";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { CurrencyProvider } from "@/context/currency-context";
import { CurrencyMonitors } from "@/components/monitors";
import { Calculator } from "@/components/calculator/calculator";
import { redirect } from "next/navigation";

export default function RootPage() {
	redirect("https://www.bcv.org.ve");

	const queryClient = new QueryClient();

	queryClient.prefetchQuery({
		queryKey: ["rates"],
		queryFn: prefetchRates,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CurrencyProvider>
				<Calculator />
				<main className="min-h-screen p-3 flex flex-col gap-3 font-sans mx-auto max-w-lg">
					<AppHeader />

					<div className="flex-grow flex flex-col gap-2 justify-evenly relative">
						<CurrencyMonitors />
					</div>

					<AppFooter />
				</main>
			</CurrencyProvider>
		</HydrationBoundary>
	);
}
