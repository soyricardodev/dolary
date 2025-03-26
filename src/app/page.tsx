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
		queryKey: ["dollarRates"],
		queryFn: getDolarRates,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<header className="w-full bg-main flex border-b-2 p-2">
				<h2>
					Estamos teniendo problemas para obtener la tasa Paralelo debido a
					bajas del servicio de la API de pydolar, se ha deshabilitado la
					calculadora mientras se resuelve por completo, pronto volvera el
					servicio a la normalidad.
				</h2>
			</header>
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
