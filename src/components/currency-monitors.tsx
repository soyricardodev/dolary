"use client";

import { Loader2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CurrencyCard } from "@/components/currency-card";
import { useCurrencyData } from "@/hooks/use-currency-data";

interface CurrencyMonitorsProps {
	onCardClick: (currency: string) => void;
}

export function CurrencyMonitors({ onCardClick }: CurrencyMonitorsProps) {
	const { data, isLoading, error, isRefetching } = useCurrencyData();

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

	if (!data) {
		return null;
	}

	// Calculate promedio (average) from BCV and Paralelo
	const bcvPrice = data.monitors.bcv.price;
	const paraleloPrice = data.monitors.enparalelovzla.price;
	const promedioPrice = (bcvPrice + paraleloPrice) / 2;

	// Calculate change and percent for promedio
	const bcvOld = data.monitors.bcv.price_old;
	const paraleloOld = data.monitors.enparalelovzla.price_old;
	const promedioOld = (bcvOld + paraleloOld) / 2;
	const promedioChange = promedioPrice - promedioOld;
	const promedioPercent = (promedioChange / promedioOld) * 100;

	return (
		<div className="relative">
			{isRefetching && (
				<div className="absolute top-0 right-0 text-black px-2 py-1 rounded-md text-xs animate-pulse z-10">
					Actualizando...
				</div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
				<CurrencyCard
					title="BCV"
					price={data.monitors.bcv.price}
					symbol={data.monitors.bcv.symbol}
					change={data.monitors.bcv.change}
					percent={data.monitors.bcv.percent}
					color={data.monitors.bcv.color}
					lastUpdate={data.monitors.bcv.last_update}
					onClick={() => onCardClick("bcv")}
					gradient="from-blue-500 to-cyan-400"
				/>

				<CurrencyCard
					title="Paralelo"
					price={data.monitors.enparalelovzla.price}
					symbol={data.monitors.enparalelovzla.symbol}
					change={data.monitors.enparalelovzla.change}
					percent={data.monitors.enparalelovzla.percent}
					color={data.monitors.enparalelovzla.color}
					lastUpdate={data.monitors.enparalelovzla.last_update}
					onClick={() => onCardClick("paralelo")}
					gradient="from-purple-500 to-pink-500"
				/>

				<CurrencyCard
					title="Promedio"
					price={promedioPrice}
					symbol="Bs."
					change={promedioChange}
					percent={promedioPercent}
					color={promedioChange >= 0 ? "#28a745" : "#dc3545"}
					onClick={() => onCardClick("promedio")}
					gradient="from-amber-500 to-orange-500"
					className="sm:col-span-2 lg:col-span-1"
				/>
			</div>
		</div>
	);
}
