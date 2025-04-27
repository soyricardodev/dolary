"use client";

import React, {
	createContext,
	useContext,
	useState,
	type ReactNode,
} from "react";

interface CalculatorContextType {
	selectedCurrency: string | null;
	calculatorVisible: boolean;
	openCalculator: (currency: string) => void;
	closeCalculator: () => void;
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(
	undefined,
);

interface CalculatorProviderProps {
	children: ReactNode;
}

export function CalculatorProvider({ children }: CalculatorProviderProps) {
	const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
	const [calculatorVisible, setCalculatorVisible] = useState(false);

	const openCalculator = (currency: string) => {
		setSelectedCurrency(currency);
		setCalculatorVisible(true);
	};

	const closeCalculator = () => {
		setCalculatorVisible(false);
		setSelectedCurrency(null);
	};

	const value = {
		selectedCurrency,
		calculatorVisible,
		openCalculator,
		closeCalculator,
	};

	return (
		<CalculatorContext.Provider value={value}>
			{children}
		</CalculatorContext.Provider>
	);
}

export function useCalculatorContext() {
	const context = useContext(CalculatorContext);
	if (context === undefined) {
		throw new Error(
			"useCalculatorContext must be used within a CalculatorProvider",
		);
	}
	return context;
}
