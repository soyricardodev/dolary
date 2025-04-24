"use client";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import { DialogTitle } from "@/components/ui/dialog";
import { Calculator } from "./calculator";
import { useCurrencyContext } from "@/context/currency-context";

interface ResponsiveCalculatorProps {
	isOpen: boolean;
	onCloseAction: () => void;
	selectedCurrency: string;
}

export function ResponsiveCalculator({
	isOpen,
	onCloseAction,
	selectedCurrency,
}: ResponsiveCalculatorProps) {
	const { data, custom } = useCurrencyContext();

	if (!data) return;

	const bcv = data.data.bcv.price;
	const paralelo = data.data.paralelo.price;
	const promedio = (bcv + paralelo) / 2;
	const eur = data.data.eur?.price ?? 0;
	const customRate = custom?.price;

	return (
		<ResponsiveDialog open={isOpen} onOpenChange={onCloseAction}>
			<DialogTitle className="my-4 text-center">Calculadora</DialogTitle>

			<Calculator
				rates={{ bcv, paralelo, promedio, eur, custom: customRate }}
				selectedCurrency={selectedCurrency}
			/>
		</ResponsiveDialog>
	);
}
