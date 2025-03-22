import { useState } from "react";
import { AppHeader } from "./components/app-header";
import { CurrencyMonitors } from "./components/currency-monitors";
import { CurrencyCalculator } from "./components/currency-calculator";
import { AppFooter } from "./components/app-footer";

export default function App() {
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
		<main className="min-h-screen p-3 flex flex-col font-sans">
			<AppHeader />

			<div className="flex-grow flex flex-col justify-center">
				<CurrencyMonitors onCardClick={handleCardClick} />
			</div>

			<AppFooter />

			{selectedCurrency && (
				<CurrencyCalculator
					currency={selectedCurrency}
					isOpen={calculatorVisible}
					onClose={closeCalculator}
				/>
			)}
		</main>
	);
}
