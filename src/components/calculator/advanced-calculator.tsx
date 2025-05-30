"use client";

import { useState, useEffect } from "react";
import * as math from "mathjs";
import { Input } from "@/components/ui/input";
import { ArrowRightLeftIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalculatorButton } from "./calculator-button";
import { ResultDisplay } from "./result-display";
import { cn } from "@/lib/utils";

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

export function AdvancedCalculator({
	rates,
	selectedCurrency,
}: CalculatorProps) {
	const [input, setInput] = useState("");
	const [previewResult, setPreviewResult] = useState("");
	const [previewCurrencyResult, setPreviewCurrencyResult] = useState("");
	const [conversionMode, setConversionMode] = useState<
		"dollarToBs" | "bsToDollar" | "eurToBs" | "bsToEur"
	>(() => {
		// Initialize conversion mode based on selected currency
		if (selectedCurrency === "eur") {
			return "eurToBs";
		}
		return "dollarToBs";
	});
	const [selectedRateType, setSelectedRateType] =
		useState<string>(selectedCurrency);

	// Currency rates ($ to Bs)
	const bcvRate = rates.bcv;
	const paraleloRate = rates.paralelo;
	const promedioRate = rates.promedio;
	const eurRate = rates.eur;
	const customRate = rates.custom;

	// Update conversion mode when selected currency changes
	useEffect(() => {
		if (selectedCurrency === "eur") {
			setConversionMode("eurToBs");
		} else if (selectedCurrency === "usd") {
			setConversionMode("dollarToBs");
		}
	}, [selectedCurrency]);

	// Get current rate based on selection
	const getCurrentRate = (): number => {
		switch (selectedRateType) {
			case "bcv":
				return bcvRate;
			case "paralelo":
				return paraleloRate;
			case "promedio":
				return promedioRate;
			case "eur":
				return eurRate;
			case "custom":
				return customRate || 0;
			default:
				return paraleloRate;
		}
	};

	// Calculate preview results in real-time
	// biome-ignore lint/correctness/useExhaustiveDependencies: We need selectedRateType so we can recalculate when the tab change
	useEffect(() => {
		if (input) {
			try {
				const mathResult = math.evaluate(input);
				const formattedResult = Number.isInteger(mathResult)
					? mathResult.toString()
					: mathResult.toFixed(2);

				const currentRate = getCurrentRate();

				if (conversionMode === "dollarToBs" || conversionMode === "eurToBs") {
					// $ or € to Bs conversion
					const bsValue = mathResult * currentRate;
					const formattedBsValue = Number.isInteger(bsValue)
						? bsValue.toString()
						: bsValue.toFixed(2);

					setPreviewResult(formattedResult);
					setPreviewCurrencyResult(formattedBsValue);
				} else {
					// Bs to $ or € conversion
					const currencyValue = mathResult / currentRate;
					const formattedCurrencyValue = currencyValue.toFixed(2);

					setPreviewResult(formattedResult);
					setPreviewCurrencyResult(formattedCurrencyValue);
				}
			} catch (error) {
				// If expression is incomplete or invalid, don't update preview
				if (input.match(/[\d)]/g)) {
					setPreviewResult("...");
					setPreviewCurrencyResult("...");
				}
			}
		} else {
			setPreviewResult("");
			setPreviewCurrencyResult("");
		}
	}, [
		input,
		conversionMode,
		selectedRateType,
		bcvRate,
		paraleloRate,
		promedioRate,
	]);

	const handleButtonClick = (value: string) => {
		if (value === "=") {
			// No need to calculate again since we have live preview
			// Just keep the current state
		} else if (value === "AC") {
			clear();
		} else if (value === "⌫") {
			backspace();
		} else if (value === "()") {
			addSmartParenthesis();
		} else if (value === "%") {
			addPercentage();
		} else {
			setInput((prev) => prev + value);
		}
	};

	const clear = () => {
		setInput("");
		setPreviewResult("");
		setPreviewCurrencyResult("");
	};

	const backspace = () => {
		setInput((prev) => prev.slice(0, -1));
	};

	// Smart parenthesis function
	const addSmartParenthesis = () => {
		// Count opening and closing parentheses
		const openCount = (input.match(/\(/g) || []).length;
		const closeCount = (input.match(/\)/g) || []).length;

		// If we have more opening than closing, or if the last character is a digit or closing parenthesis,
		// add a closing parenthesis
		if (
			openCount > closeCount &&
			(input.match(/[\d)]$/) || input.length === 0)
		) {
			setInput((prev) => `${prev})`);
		} else {
			// Otherwise add an opening parenthesis
			setInput((prev) => `${prev}(`);
		}
	};

	// Percentage function
	const addPercentage = () => {
		// If input is empty, do nothing
		if (input === "") return;

		try {
			// Try to evaluate the current expression
			const currentValue = math.evaluate(input);
			// Convert to percentage (divide by 100)
			const percentValue = currentValue / 100;
			// Update input with the percentage value
			setInput(percentValue.toString());
		} catch (error) {
			// If we can't evaluate, just append % and let math.js handle it
			setInput((prev) => `${prev}/100`);
		}
	};

	const toggleConversionMode = () => {
		setConversionMode((prev) => {
			if (prev === "dollarToBs") return "bsToDollar";
			if (prev === "bsToDollar") return "eurToBs";
			if (prev === "eurToBs") return "bsToEur";
			return "dollarToBs";
		});
	};

	const getConversionText = () => {
		// Simplified conversion text that doesn't depend on the specific currency
		return conversionMode === "dollarToBs" || conversionMode === "eurToBs"
			? "Monitor → Bs"
			: "Bs → Monitor";
	};

	const getResultLabel = () => {
		// Simplified result label that doesn't depend on the specific currency
		return conversionMode === "dollarToBs" || conversionMode === "eurToBs"
			? "Total en Monitor:"
			: "Total en Bs:";
	};

	const getCurrencyResultLabel = () => {
		// Simplified currency result label that doesn't depend on the specific currency
		return conversionMode === "dollarToBs" || conversionMode === "eurToBs"
			? "En Bolivares:"
			: "En Monitor:";
	};

	return (
		<div className="flex flex-col gap-2">
			{/* Currency Selector with Improved Toggle Button */}
			<div className="bg-main p-2 sm:p-3 border-black border-2 rounded-md">
				<div className="flex flex-col space-y-2 sm:space-y-3">
					{/* Currency Direction Toggle - Improved Position */}
					<div className="flex items-center justify-between mb-1 sm:mb-1.5">
						<span className="font-bold text-[0.8rem] sm:text-sm text-main-foreground mr-2">
							Modo de conversión:
						</span>
						<Button
							onClick={toggleConversionMode}
							variant={"noShadow"}
							className="px-2 h-8 sm:h-9"
						>
							<ArrowRightLeftIcon size={14} />
							<span className="font-medium sm:font-bold text-[0.7rem] sm:text-sm ml-1 sm:ml-1.5 text-center">
								{getConversionText()}
							</span>
						</Button>
					</div>

					{/* Currency Type Tabs */}
					<Tabs
						defaultValue="paralelo"
						value={selectedRateType}
						onValueChange={setSelectedRateType}
						className="w-full"
					>
						<TabsList
							className={cn(
								"grid",
								rates.custom != null ? "grid-cols-5" : "grid-cols-4",
							)}
						>
							<TabsTrigger
								value="bcv"
								className="data-[state=active]:bg-white text-xs sm:text-sm"
							>
								BCV
							</TabsTrigger>
							<TabsTrigger
								value="paralelo"
								className="data-[state=active]:bg-white text-xs sm:text-sm h-full"
							>
								Paralelo
							</TabsTrigger>
							<TabsTrigger
								value="promedio"
								className="data-[state=active]:bg-white text-xs sm:text-sm h-full"
							>
								Promedio
							</TabsTrigger>
							<TabsTrigger
								value="eur"
								className="data-[state=active]:bg-white text-xs sm:text-sm h-full"
							>
								EUR
							</TabsTrigger>
							{rates.custom != null ? (
								<TabsTrigger
									value="custom"
									className="data-[state=active]:bg-white text-xs sm:text-sm h-full"
								>
									Personal
								</TabsTrigger>
							) : null}
						</TabsList>
					</Tabs>
				</div>

				{/* Hidden inputs for rates */}
				<input type="hidden" value={bcvRate} />
				<input type="hidden" value={paraleloRate} />
				<input type="hidden" value={promedioRate} />
				<input type="hidden" value={customRate} />
			</div>

			{/* Calculator Display */}
			<div className="space-y-3">
				<Input
					readOnly
					tabIndex={-1}
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className="pointer-events-none text-right text-lg sm:text-xl font-mono border-black border-2 h-14 focus:ring-black focus:ring-offset-2"
					placeholder={"Ingrese monto..."}
				/>

				{/* Results Display */}
				<div className="grid grid-cols-2 gap-3">
					<ResultDisplay
						label={getResultLabel()}
						value={previewResult || "0"}
					/>
					<ResultDisplay
						label={getCurrencyResultLabel()}
						value={previewCurrencyResult || "0"}
					/>
				</div>
			</div>

			{/* Calculator Buttons */}
			<div className="grid grid-cols-4 gap-1.5 sm:gap-2">
				{/* Row 1: AC, (), %, ÷ */}
				<CalculatorButton
					onClickAction={() => handleButtonClick("AC")}
					variant="function"
				>
					AC
				</CalculatorButton>
				<CalculatorButton
					onClickAction={() => handleButtonClick("()")}
					variant="function"
				>
					( )
				</CalculatorButton>
				<CalculatorButton
					onClickAction={() => handleButtonClick("%")}
					variant="function"
					icon="percent"
				/>
				<CalculatorButton
					onClickAction={() => handleButtonClick("/")}
					variant="function"
				>
					÷
				</CalculatorButton>

				{/* Row 2: 7-8-9-× */}
				<CalculatorButton
					onClickAction={() => handleButtonClick("7")}
					variant="number"
				>
					7
				</CalculatorButton>
				<CalculatorButton
					onClickAction={() => handleButtonClick("8")}
					variant="number"
				>
					8
				</CalculatorButton>
				<CalculatorButton
					onClickAction={() => handleButtonClick("9")}
					variant="number"
				>
					9
				</CalculatorButton>
				<CalculatorButton
					onClickAction={() => handleButtonClick("*")}
					variant="function"
				>
					×
				</CalculatorButton>

				{/* Row 3: 4-5-6-- */}
				<CalculatorButton
					onClickAction={() => handleButtonClick("4")}
					variant="number"
				>
					4
				</CalculatorButton>
				<CalculatorButton
					onClickAction={() => handleButtonClick("5")}
					variant="number"
				>
					5
				</CalculatorButton>
				<CalculatorButton
					onClickAction={() => handleButtonClick("6")}
					variant="number"
				>
					6
				</CalculatorButton>
				<CalculatorButton
					onClickAction={() => handleButtonClick("-")}
					variant="function"
				>
					−
				</CalculatorButton>

				{/* Row 4: 1-2-3-+ */}
				<CalculatorButton
					onClickAction={() => handleButtonClick("1")}
					variant="number"
				>
					1
				</CalculatorButton>
				<CalculatorButton
					onClickAction={() => handleButtonClick("2")}
					variant="number"
				>
					2
				</CalculatorButton>
				<CalculatorButton
					onClickAction={() => handleButtonClick("3")}
					variant="number"
				>
					3
				</CalculatorButton>
				<CalculatorButton
					onClickAction={() => handleButtonClick("+")}
					variant="function"
				>
					+
				</CalculatorButton>

				{/* Row 5: 0-.-⌫-= */}
				<CalculatorButton
					onClickAction={() => handleButtonClick("0")}
					variant="number"
				>
					0
				</CalculatorButton>
				<CalculatorButton
					onClickAction={() => handleButtonClick(".")}
					variant="number"
				>
					.
				</CalculatorButton>
				<CalculatorButton
					onClickAction={() => handleButtonClick("⌫")}
					variant="delete"
					icon="delete"
				/>
				<CalculatorButton
					onClickAction={() => handleButtonClick("=")}
					variant="equals"
				>
					=
				</CalculatorButton>
			</div>
		</div>
	);
}
