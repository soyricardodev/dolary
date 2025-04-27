"use client";

import { Loader2Icon } from "lucide-react";
import { InfoIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CurrencyCard } from "@/components/currency-card";
import { useCurrencyContext } from "@/context/currency-context";
import { CustomCurrencyCard } from "./custom-currency-card";
import { formatVenezuelaDate } from "@/lib/utils";

export function CurrencyMonitors() {
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
	const eur = data.data.euro;

	return (
		<div className="relative">
			<div className="grid grid-cols-1 gap-3">
				<CurrencyCard
					title="Dólar BCV"
					key="bcv"
					price={bcv.price}
					symbol={bcv.symbol}
					change={bcv.change}
					percent={bcv.percent}
					color={bcv.color}
					lastUpdate={formatVenezuelaDate(bcv.last_update ?? new Date(), {
						prefix: "Vigente hasta: ",
					})}
				/>

				<CurrencyCard
					key="paralelo"
					title="Dólar Paralelo"
					price={paralelo.price}
					symbol={paralelo.symbol}
					change={paralelo.change}
					percent={paralelo.percent}
					color={paralelo.color}
					lastUpdate={formatVenezuelaDate(paralelo.last_update ?? new Date(), {
						withTime: true,
					})}
				/>

				<CurrencyCard
					key="promedio"
					title="Dólar Promedio"
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
				/>

				{eur != null ? (
					<CurrencyCard
						key="eur"
						title="Euro BCV"
						price={eur.price}
						symbol={eur.symbol}
						change={eur.change}
						percent={eur.percent}
						color={eur.color}
						lastUpdate={formatVenezuelaDate(eur.last_update ?? new Date(), {
							prefix: "Vigente hasta: ",
						})}
					/>
				) : (
					<div className="h-12" />
				)}
				<CustomCurrencyCard key="custom" />
			</div>
		</div>
	);
}
