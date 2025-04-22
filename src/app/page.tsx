import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { Dolary } from "@/components/dolary";
import { getDolarRates } from "@/queries";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { CurrencyProvider } from "@/context/currency-context";

export default async function RootPage() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["rates"],
		queryFn: getDolarRates,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<main className="min-h-screen p-3 flex flex-col gap-3 font-sans mx-auto">
				<AppHeader />

				<div className="flex-grow flex flex-col gap-2 justify-evenly relative">
					<h1 className="text-2xl font-extrabold text-center ">
						¡Bienvenido a Dolary!
					</h1>
					<CurrencyProvider>
						<Dolary />
					</CurrencyProvider>
				</div>

				<AppFooter />
			</main>
		</HydrationBoundary>
	);
}
