import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { getDolarRates } from "@/queries";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { CurrencyProvider } from "@/context/currency-context";
import { Dolary } from "@/components/dolary";

export const dynamic = "force-dynamic";

export default async function RootPage() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["rates"],
		queryFn: getDolarRates,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<main className="min-h-screen p-3 flex flex-col gap-3 font-sans mx-auto max-w-lg">
				<AppHeader />

				<div className="flex-grow flex flex-col gap-2 justify-evenly relative">
					<CurrencyProvider>
						<Dolary />
					</CurrencyProvider>
				</div>

				<AppFooter />
			</main>
		</HydrationBoundary>
	);
}
