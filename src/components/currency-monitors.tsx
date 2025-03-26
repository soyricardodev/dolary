"use client";

import { Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CurrencyCard } from "@/components/currency-card";
import { useCurrencyData } from "@/hooks/use-currency-data";
import { CustomCurrencyCard } from "./custom-currency-card";

interface CurrencyMonitorsProps {
	onCardClick: (currency: string) => void;
}

export function CurrencyMonitors({ onCardClick }: CurrencyMonitorsProps) {
	// const { data, isLoading, error, isRefetching } = useCurrencyData();

	// if (isLoading) {
	// 	return (
	// 		<div className="flex justify-center items-center h-32">
	// 			<Loader2 className="h-6 w-6 animate-spin text-primary" />
	// 			<span className="ml-2 text-gray-600 text-sm">Cargando datos...</span>
	// 		</div>
	// 	);
	// }

	// if (error) {
	// 	return (
	// 		<Alert variant="destructive" className="text-sm">
	// 			<AlertTitle>Error</AlertTitle>
	// 			<AlertDescription>
	// 				No se pudieron cargar los datos. Por favor intente más tarde.
	// 			</AlertDescription>
	// 		</Alert>
	// 	);
	// }

	// if (!data) {
	// 	return null;
	// }

	// Calculate promedio (average) from BCV and Paralelo
	const bcvPrice = 68.7;
	const paraleloPrice = 102.92;
	const promedioPrice = (bcvPrice + paraleloPrice) / 2;

	// // Calculate change and percent for promedio
	// const bcvOld = data.monitors.bcv.price_old;
	// const paraleloOld = data.monitors.enparalelovzla.price_old;
	// const promedioOld = (bcvOld + paraleloOld) / 2;
	// const promedioChange = promedioPrice - promedioOld;
	// const promedioPercent = (promedioChange / promedioOld) * 100;

	return (
		<div className="relative">
			{/* {isRefetching && (
				<div className="absolute top-0 right-0 text-black px-2 py-1 rounded-md text-xs animate-pulse z-10">
					Actualizando...
				</div>
			)} */}

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
				<CurrencyCard
					title="BCV"
					price={bcvPrice}
					symbol={"▲"}
					change={3.96}
					percent={3.96}
					color={"red"}
					lastUpdate={"2025-03-26T12:00:01.000-04:00"}
					onClick={() => onCardClick("bcv")}
				/>

				<CurrencyCard
					title="Paralelo"
					price={102.92}
					symbol={"▲"}
					change={3.96}
					percent={3.96}
					color={"red"}
					lastUpdate={"2025-03-26T01:30:01.000-04:00"}
					onClick={() => onCardClick("paralelo")}
				/>

				<CurrencyCard
					title="Promedio"
					price={promedioPrice}
					symbol="Bs."
					change={0}
					percent={0}
					color={"#28a745"}
					onClick={() => onCardClick("promedio")}
				/>

				<CustomCurrencyCard onClick={() => onCardClick("custom")} />
			</div>
		</div>
	);
}
