"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import useLocalStorage from "@/hooks/use-local-storage";
import { type CalculatorMode, CalculatorModeKey } from "@/types";
import { AdvancedCalculator } from "./advanced-calculator";
import { SimpleCalculator } from "./simple-calculator";

interface CalculatorProps {
	rates: {
		bcv: number;
		paralelo: number;
		promedio: number;
		eur: number;
		custom?: number;
	};
	selectedCurrency: string;
}

export function Calculator({ rates, selectedCurrency }: CalculatorProps) {
	// Use local storage for calculator mode
	const [calculatorMode, setCalculatorMode] = useLocalStorage<CalculatorMode>(
		CalculatorModeKey,
		"advanced", // Default to advanced mode
	);

	const handleModeChange = (checked: boolean) => {
		setCalculatorMode(checked ? "simple" : "advanced");
	};

	return (
		<div className="flex flex-col gap-2">
			{/* Calculator Header with Mode Switch */}
			<div className="bg-main p-2 sm:p-3 border-black border-2 rounded-md">
				<div className="flex items-center justify-between mb-2">
					<div className="flex items-center space-x-2">
						<Switch
							id="calculator-mode"
							checked={calculatorMode === "simple"}
							onCheckedChange={handleModeChange}
						/>
						<Label
							htmlFor="calculator-mode"
							className="text-sm text-main-foreground"
						>
							Modo Simple
						</Label>
					</div>
				</div>

				{/* Render calculator based on mode */}
				{calculatorMode === "simple" ? (
					<SimpleCalculator rates={rates} />
				) : (
					<AdvancedCalculator
						rates={rates}
						selectedCurrency={selectedCurrency}
					/>
				)}
			</div>
		</div>
	);
}
