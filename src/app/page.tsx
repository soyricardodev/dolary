import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { Dolary } from "@/components/dolary";
import { getDolarRates } from "@/queries";
import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";

export default async function RootPage() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["rates"],
		queryFn: getDolarRates,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<main className="min-h-screen p-3 flex flex-col font-sans mx-auto">
				<AppHeader />

				<div className="flex-grow flex flex-col justify-center">
					<Dolary />
				</div>

				<AppFooter />
			</main>
		</HydrationBoundary>
	);
}
