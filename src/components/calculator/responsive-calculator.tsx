"use client";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import { DialogTitle } from "@/components/ui/dialog";
import { Calculator } from "./calculator";
import { useCurrencyContext } from "@/context/currency-context";
import { useCalculatorContext } from "@/context/calculator-context";

export function ResponsiveCalculator() {
	const { data, custom } = useCurrencyContext();
	const { calculatorVisible, closeCalculator, selectedCurrency } =
		useCalculatorContext();

	if (!data) return null;

	const bcv = data.data.bcv.price;
	const paralelo = data.data.paralelo.price;
	const promedio = (bcv + paralelo) / 2;
	const eur = data.data.euro?.price ?? 0;
	const customRate = custom?.price;

	if (!selectedCurrency) return null;

	return (
		<ResponsiveDialog open={calculatorVisible} onOpenChange={closeCalculator}>
			<DialogTitle className="my-4 text-center hidden">Calculadora</DialogTitle>

			<Calculator
				rates={{ bcv, paralelo, promedio, eur, custom: customRate }}
				selectedCurrency={selectedCurrency}
			/>
		</ResponsiveDialog>
	);
}
