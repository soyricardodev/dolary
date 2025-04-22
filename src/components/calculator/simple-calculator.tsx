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
		setConversionMode((prev) =>
			prev === "dollarToBs" ? "bsToDollar" : "dollarToBs",
		);
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
						{conversionMode === "dollarToBs" ? "USD → Bs" : "Bs → USD"}
					</span>
				</Button>
			</div>

			{/* Input */}
			<div className="space-y-4">
				<Input
					type="number"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder={
						conversionMode === "dollarToBs"
							? "Ingrese monto en USD..."
							: "Ingrese monto en Bs..."
					}
					className="text-right text-lg sm:text-xl font-mono text-foreground h-14"
					autoFocus
				/>

				{/* All Rates Results */}
				<div className="space-y-2">
					<h3 className="text-sm font-bold px-1 text-main-foreground">
						{conversionMode === "dollarToBs" ? "En Bolivares:" : "En USD:"}
					</h3>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
						{/* BCV Result */}
						<div className="bg-secondary-background p-3 rounded-md border-2 border-black transition-colors">
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium text-foreground">BCV</span>
								<div className="flex items-center gap-2">
									<span className="text-lg font-bold text-foreground">
										{calculateResult(rates.bcv)}
									</span>
									<Button
										onClick={() =>
											handleCopy(calculateResult(rates.bcv), "bcv")
										}
										size="icon"
										variant="noShadow"
										className="size-8 p-0 [&_svg]:size-4"
									>
										{copiedRate === "bcv" ? (
											<CheckIcon className="size-4" />
										) : (
											<CopyIcon className="size-4" />
										)}
									</Button>
								</div>
							</div>
							<div className="text-xs mt-1">
								Tasa: {formatCurrency(rates.bcv)} Bs
							</div>
						</div>

						{/* Paralelo Result */}
						<div className="bg-secondary-background p-3 rounded-md border-2 border-black transition-colors">
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium text-foreground">
									Paralelo
								</span>
								<div className="flex items-center gap-2">
									<span className="text-lg font-bold text-foreground">
										{calculateResult(rates.paralelo)}
									</span>
									<Button
										onClick={() =>
											handleCopy(calculateResult(rates.paralelo), "paralelo")
										}
										size="icon"
										variant="noShadow"
										className="size-8 p-0 [&_svg]:size-4"
									>
										{copiedRate === "paralelo" ? (
											<CheckIcon className="size-4" />
										) : (
											<CopyIcon className="size-4" />
										)}
									</Button>
								</div>
							</div>
							<div className="text-xs mt-1">
								Tasa: {formatCurrency(rates.paralelo)} Bs
							</div>
						</div>

						{/* Promedio Result */}
						<div className="bg-secondary-background p-3 rounded-md border-2 border-black transition-colors">
							<div className="flex justify-between items-center">
								<span className="text-sm font-medium text-foreground">
									Promedio
								</span>
								<div className="flex items-center gap-2">
									<span className="text-lg font-bold text-foreground">
										{calculateResult(rates.promedio)}
									</span>
									<Button
										onClick={() =>
											handleCopy(calculateResult(rates.promedio), "promedio")
										}
										size="icon"
										variant="noShadow"
										className="size-8 p-0 [&_svg]:size-4"
									>
										{copiedRate === "promedio" ? (
											<CheckIcon className="size-4" />
										) : (
											<CopyIcon className="size-4" />
										)}
									</Button>
								</div>
							</div>
							<div className="text-xs mt-1">
								Tasa: {formatCurrency(rates.promedio)} Bs
							</div>
						</div>

						{/* Custom Result (if available) */}
						{rates.custom != null && (
							<div className="bg-secondary-background p-3 rounded-md border-2 border-black transition-colors">
								<div className="flex justify-between items-center">
									<span className="text-sm font-medium text-foreground">
										Personal
									</span>
									<div className="flex items-center gap-2">
										<span className="text-lg font-bold text-foreground">
											{calculateResult(rates.custom)}
										</span>
										<Button
											onClick={() =>
												handleCopy(calculateResult(rates.custom ?? 0), "custom")
											}
											size="icon"
											variant="noShadow"
											className="size-8 p-0 [&_svg]:size-4"
										>
											{copiedRate === "custom" ? (
												<CheckIcon className="size-4" />
											) : (
												<CopyIcon className="size-4" />
											)}
										</Button>
									</div>
								</div>
								<div className="text-xs mt-1">
									Tasa: {formatCurrency(rates.custom)} Bs
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
