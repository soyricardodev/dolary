"use client";

import { ResponsiveDialog } from "@/components/responsive-dialog";
import { DialogTitle } from "@/components/ui/dialog";
import { Calculator } from "./calculator";
import { useCurrencyData } from "@/hooks/use-currency-data";

interface ResponsiveCalculatorProps {
	isOpen: boolean;
	onCloseAction: () => void;
}

export function ResponsiveCalculator({
	isOpen,
	onCloseAction,
}: ResponsiveCalculatorProps) {
	const { data } = useCurrencyData();

	if (!data) return;

	const bcv = data.data.bcv.price;
	const paralelo = data.data.paralelo.price;
	const promedio = (bcv + paralelo) / 2;

	return (
		<ResponsiveDialog open={isOpen} onOpenChange={onCloseAction}>
			<DialogTitle className="my-4 text-center">
				Agrega tu tasa personalizada
			</DialogTitle>

			<Calculator rates={{ bcv, paralelo, promedio }} />
		</ResponsiveDialog>
	);
}
