"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import useLocalStorage from "@/hooks/use-local-storage";
import { type CalculatorMode, CalculatorModeKey } from "@/types";
import { AdvancedCalculator } from "./advanced-calculator";
import { SimpleCalculator } from "./simple-calculator";
import { ResponsiveDialog } from "../responsive-dialog";
import { useCalculatorContext } from "@/context/calculator-context";
import { useCurrencyContext } from "@/context/currency-context";
import { DialogTitle } from "../ui/dialog";

export function Calculator() {
	const { data, custom } = useCurrencyContext();
	const { calculatorVisible, closeCalculator, selectedCurrency } =
		useCalculatorContext();
	const [calculatorMode, setCalculatorMode] = useLocalStorage<CalculatorMode>(
		CalculatorModeKey,
		"simple", // Default to simple mode
	);

	if (!data) return null;

	const bcv = data.data.bcv.price;
	const paralelo = data.data.paralelo.price;
	const promedio = (bcv + paralelo) / 2;
	const eur = data.data.euro?.price ?? 0;
	const customRate = custom?.price;
	const rates = { bcv, paralelo, promedio, eur, custom: customRate };

	if (!selectedCurrency) return null;

	const handleModeChange = (checked: boolean) => {
		setCalculatorMode(checked ? "advanced" : "simple");
	};

	return (
		<ResponsiveDialog open={calculatorVisible} onOpenChange={closeCalculator}>
			<DialogTitle className="my-4 text-center">Calculadora</DialogTitle>

			<div className="flex flex-col gap-2">
				{/* Calculator Header with Mode Switch */}
				<div className="bg-main p-2 sm:p-3 border-black border-2 rounded-md">
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center space-x-2">
							<Switch
								id="calculator-mode"
								checked={calculatorMode === "advanced"}
								onCheckedChange={handleModeChange}
							/>
							<Label
								htmlFor="calculator-mode"
								className="text-sm text-main-foreground"
							>
								Modo Avanzado
							</Label>
						</div>
					</div>

					{/* Render calculator based on mode */}
					{calculatorMode === "simple" ? (
						<SimpleCalculator rates={rates} />
					) : null}

					{calculatorMode === "advanced" ? (
						<AdvancedCalculator
							rates={rates}
							selectedCurrency={selectedCurrency}
						/>
					) : null}
				</div>
			</div>
		</ResponsiveDialog>
	);
}
