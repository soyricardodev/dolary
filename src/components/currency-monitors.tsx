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
	const { data, isLoading, error } = useCurrencyData();

	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-32">
				<Loader2 className="h-6 w-6 animate-spin text-primary" />
				<span className="ml-2 text-gray-600 text-sm">Cargando datos...</span>
			</div>
		);
	}

	if (error) {
		return (
			<Alert variant="destructive" className="text-sm">
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>
					No se pudieron cargar los datos. Por favor intente más tarde.
				</AlertDescription>
			</Alert>
		);
	}

	if (!data) return null;

	// Calculate promedio (average) from BCV and Paralelo
	const bcv = data.data.bcv;
	const paralelo = data.data.paralelo;
	const bcvPrice = bcv.price;
	const paraleloPrice = paralelo.price;
	const promedioPrice = (bcvPrice + paraleloPrice) / 2;

	// // Calculate change and percent for promedio
	const promedioOld = ((bcv.price_old ?? 0) + (paralelo.price_old ?? 0)) / 2;
	const promedioChange = Number.parseFloat(
		(promedioPrice - promedioOld).toFixed(2),
	);
	const promedioPercent = Number.parseFloat(
		((promedioChange / promedioPrice) * 100 || 0).toFixed(2).replace("-", ""),
	);
	// Determine color for promedio based on its change
	const promedioColor =
		promedioPrice < promedioOld
			? "red"
			: promedioPrice > promedioOld
				? "green"
				: "neutral";
	// Determine the symbol for promedio based on its change
	const promedioSymbol =
		promedioColor === "green" ? "▲" : promedioColor === "red" ? "▼" : "";
	const sanitizedChange = Number.parseFloat(
		promedioChange.toString().replace("-", ""),
	);

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
					symbol={bcv.symbol}
					change={bcv.change}
					percent={bcv.percent}
					color={bcv.color}
					lastUpdate={new Date(
						new Date(bcv.last_update ?? new Date()).toLocaleString("en-US", {
							timeZone: "America/Caracas",
							hour12: true, // Enable AM/PM format
						}),
					).toLocaleString()}
					onClick={() => onCardClick("bcv")}
				/>

				<CurrencyCard
					title="Paralelo"
					price={paraleloPrice}
					symbol={paralelo.symbol}
					change={paralelo.change}
					percent={paralelo.percent}
					color={paralelo.color}
					lastUpdate={new Date(
						new Date(paralelo.last_update ?? new Date()).toLocaleString(
							"en-US",
							{
								timeZone: "America/Caracas",
								hour12: true, // Enable AM/PM format
							},
						),
					).toLocaleString()}
					onClick={() => onCardClick("paralelo")}
				/>

				<CurrencyCard
					title="Promedio"
					price={promedioPrice}
					symbol={promedioSymbol}
					change={sanitizedChange}
					percent={promedioPercent}
					color={promedioColor}
					onClick={() => onCardClick("promedio")}
				/>

				<CustomCurrencyCard onClick={() => onCardClick("custom")} />
			</div>
		</div>
	);
}
