"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRightLeftIcon, CopyIcon, CheckIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
interface SimpleCalculatorProps {
	rates: {
		bcv: number;
		paralelo: number;
		promedio: number;
		eur: number;
		custom?: number;
	};
}

export function SimpleCalculator({ rates }: SimpleCalculatorProps) {
	const [input, setInput] = useState("1");
	const [conversionMode, setConversionMode] = useState<
		"dollarToBs" | "bsToDollar"
	>("dollarToBs");
	const [copiedRate, setCopiedRate] = useState<string | null>(null);

	const calculateResult = (rate: number): string => {
		const amount = Number.parseFloat(input) || 0;
		return formatCurrency(
			conversionMode === "dollarToBs" ? amount * rate : amount / rate,
		);
	};

	const handleCopy = (value: string, rateId: string) => {
		navigator.clipboard.writeText(value);
		setCopiedRate(rateId);
		setTimeout(() => setCopiedRate(null), 2000);
	};

	const toggleConversionMode = () => {
		setConversionMode((prev) => {
			if (prev === "dollarToBs") return "bsToDollar";
			return "dollarToBs";
		});
	};

	const getConversionText = () => {
		switch (conversionMode) {
			case "dollarToBs":
				return "Monitor → Bs";
			case "bsToDollar":
				return "Bs → Monitor";
			default:
				return "Monitor → Bs";
		}
	};

	const getResultLabel = () => {
		switch (conversionMode) {
			case "dollarToBs":
				return "En Bolivares:";
			case "bsToDollar":
				return "En Monitor:";
			default:
				return "En Bolivares:";
		}
	};

	return (
		<div className="space-y-3">
			{/* Conversion Mode Toggle */}
			<div className="flex items-center justify-between mb-1 sm:mb-1.5">
				<span className="font-bold text-[0.8rem] sm:text-sm text-main-foreground mr-2">
					Modo de conversión:
				</span>
				<Button
					onClick={toggleConversionMode}
					variant="noShadow"
					className="px-2 h-8 sm:h-9"
				>
					<ArrowRightLeftIcon size={14} />
					<span className="font-medium sm:font-bold text-[0.7rem] sm:text-sm ml-1 sm:ml-1.5 text-center text-main-foreground">
						{getConversionText()}
					</span>
				</Button>
			</div>

			{/* Input */}
			<div className="space-y-4">
				<Input
					type="number"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder={"Ingrese monto..."}
					className="text-right text-lg sm:text-xl font-mono text-foreground h-14"
					autoFocus
				/>

				{/* All Rates Results */}
				<div className="space-y-2">
					<h3 className="text-sm font-bold px-1 text-main-foreground">
						{getResultLabel()}
					</h3>

					<div className="grid grid-cols-2 gap-2">
						{/* BCV Result */}
						<RateCard
							rate={rates.bcv}
							label="BCV"
							rateType="bcv"
							copiedRate={copiedRate}
							onCopy={handleCopy}
							calculateResult={calculateResult}
							formatCurrency={formatCurrency}
						/>

						<RateCard
							rate={rates.paralelo}
							label="Paralelo"
							rateType="paralelo"
							copiedRate={copiedRate}
							onCopy={handleCopy}
							calculateResult={calculateResult}
							formatCurrency={formatCurrency}
						/>

						<RateCard
							rate={rates.promedio}
							label="Promedio"
							rateType="promedio"
							copiedRate={copiedRate}
							onCopy={handleCopy}
							calculateResult={calculateResult}
							formatCurrency={formatCurrency}
						/>

						<RateCard
							rate={rates.eur}
							label="EUR"
							rateType="eur"
							copiedRate={copiedRate}
							onCopy={handleCopy}
							calculateResult={calculateResult}
							formatCurrency={formatCurrency}
						/>

						{rates.custom != null && (
							<RateCard
								rate={rates.custom}
								label="Personal"
								rateType="custom"
								copiedRate={copiedRate}
								onCopy={handleCopy}
								calculateResult={calculateResult}
								formatCurrency={formatCurrency}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

interface RateCardProps {
	rate: number | null;
	label: string;
	rateType: "bcv" | "paralelo" | "custom" | "eur" | "promedio";
	copiedRate: string | null;
	onCopy: (value: string, type: string) => void;
	calculateResult: (rate: number) => string;
	formatCurrency: (rate: number) => string;
}

function RateCard({
	rate,
	label,
	rateType,
	copiedRate,
	onCopy,
	calculateResult,
	formatCurrency,
}: RateCardProps) {
	return (
		<div className="bg-secondary-background p-2 rounded-md border-2 border-black flex flex-col items-center text-center">
			<div className="flex items-center justify-between w-full">
				<span className="text-base font-medium text-foreground">{label}</span>
				<Button
					onClick={() => rate && onCopy(calculateResult(rate), rateType)}
					size="icon"
					variant="noShadow"
					className="size-7 p-0 [&_svg]:size-4"
				>
					{copiedRate === rateType ? (
						<CheckIcon className="size-4" />
					) : (
						<CopyIcon className="size-4" />
					)}
				</Button>
			</div>

			<span className="w-full text-xl sm:text-2xl font-bold text-foreground">
				{rate ? calculateResult(rate) : "N/A"}
			</span>

			<div className="text-xs text-muted-foreground">
				Tasa: {rate ? formatCurrency(rate) : "N/A"} Bs
			</div>
		</div>
	);
}
