"use client";

import { CurrencyMonitors } from "./currency-monitors";
import { ResponsiveCalculator } from "./calculator/responsive-calculator";

export function Dolary() {
	return (
		<>
			<CurrencyMonitors />

			<ResponsiveCalculator />
		</>
	);
}
