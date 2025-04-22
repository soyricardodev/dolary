"use client";

import { useState } from "react";
import { CurrencyMonitors } from "./currency-monitors";
import { ResponsiveCalculator } from "./calculator/responsive-calculator";

export function Dolary() {
	const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
	const [calculatorVisible, setCalculatorVisible] = useState(false);

	const handleCardClick = (currency: string) => {
		setSelectedCurrency(currency);
		setCalculatorVisible(true);
	};

	const closeCalculator = () => {
		setCalculatorVisible(false);
		setSelectedCurrency(null);
	};

	return (
		<>
			<CurrencyMonitors onCardClickAction={handleCardClick} />

			{selectedCurrency && (
				<ResponsiveCalculator
					isOpen={calculatorVisible}
					onCloseAction={closeCalculator}
					selectedCurrency={selectedCurrency}
				/>
			)}
		</>
	);
}
