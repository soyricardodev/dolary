"use client";

import { Loader2Icon } from "lucide-react";
import { InfoIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CurrencyCard } from "@/components/currency-card";
import { useCurrencyContext } from "@/context/currency-context";
import { CustomCurrencyCard } from "./custom-currency-card";
import { formatVenezuelaDate } from "@/lib/utils";

interface CurrencyMonitorsProps {
	onCardClickAction: (currency: string) => void;
}

export function CurrencyMonitors({ onCardClickAction }: CurrencyMonitorsProps) {
	const { data, promedio, isLoading, error } = useCurrencyContext();

	if (isLoading && !data) {
		return (
			<div className="flex justify-center items-center h-32">
				<Loader2Icon className="h-6 w-6 animate-spin text-primary" />
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

	if (!data || !data.data || !promedio) return null;

	// Data is now sourced from context
	const bcv = data.data.bcv;
	const paralelo = data.data.paralelo;

	return (
		<div className="relative">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
				<CurrencyCard
					title="BCV"
					price={bcv.price}
					symbol={bcv.symbol}
					change={bcv.change}
					percent={bcv.percent}
					color={bcv.color}
					lastUpdate={formatVenezuelaDate(bcv.last_update ?? new Date(), {
						prefix: "Vigente hasta: ",
					})}
					onClick={() => onCardClickAction("bcv")}
				/>

				<CurrencyCard
					title="Paralelo"
					price={paralelo.price}
					symbol={paralelo.symbol}
					change={paralelo.change}
					percent={paralelo.percent}
					color={paralelo.color}
					lastUpdate={formatVenezuelaDate(paralelo.last_update ?? new Date(), {
						withTime: true,
						prefix: "Actualizado: ",
					})}
					onClick={() => onCardClickAction("paralelo")}
				/>

				<CurrencyCard
					title="Promedio"
					price={promedio.price}
					symbol={promedio.symbol}
					change={promedio.change}
					percent={promedio.percent}
					color={promedio.color}
					subtitle={
						<span className="flex items-center gap-1">
							<InfoIcon size={14} className="text-muted-foreground" />
							Promedio entre BCV y Paralelo
						</span>
					}
					onClick={() => onCardClickAction("promedio")}
				/>

				<CustomCurrencyCard onClickAction={() => onCardClickAction("custom")} />
			</div>
		</div>
	);
}
