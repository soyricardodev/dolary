"use client";

import { useState } from "react";
import { CurrencyMonitors } from "./currency-monitors";
import { CurrencyCalculator } from "./currency-calculator";

export function Dolary() {
	const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
	const [calculatorVisible, setCalculatorVisible] = useState(false);

	const handleCardClick = (currency: string) => {
		setSelectedCurrency(currency);
		setCalculatorVisible(true);
	};

	const closeCalculator = () => {
		setCalculatorVisible(false);
	};

	return (
		<>
			<CurrencyMonitors onCardClick={handleCardClick} />

			{selectedCurrency && (
				<CurrencyCalculator
					currency={selectedCurrency}
					isOpen={calculatorVisible}
					onClose={closeCalculator}
				/>
			)}
		</>
	);
}
