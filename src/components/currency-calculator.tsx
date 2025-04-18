import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
	ArrowDownUpIcon,
	CopyIcon,
	CheckIcon,
	XCircleIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import { useCurrencyData } from "@/hooks/use-currency-data";
import { Label } from "./ui/label";
import { ResponsiveDialog } from "./responsive-dialog";
import { DialogTitle } from "./ui/dialog";
import useLocalStorage from "@/hooks/use-local-storage";
import { type CustomPromedio, CustomPromedioKey } from "@/types";

interface CalculatorProps {
	currency: string;
	isOpen: boolean;
	onClose: () => void;
}

export function CurrencyCalculator({
	currency,
	isOpen,
	onClose,
}: CalculatorProps) {
	const [usdAmount, setUsdAmount] = useState<string>("1");
	const [bsAmount, setBsAmount] = useState<string>("");
	const [lastEdited, setLastEdited] = useState<"usd" | "bs">("usd");
	const [copiedUsd, setCopiedUsd] = useState(false);
	const [copiedBs, setCopiedBs] = useState(false);

	const usdInputRef = useRef<HTMLInputElement>(null);
	const bsInputRef = useRef<HTMLInputElement>(null);

	const { data } = useCurrencyData();

	const [customPromedio] = useLocalStorage<CustomPromedio>(CustomPromedioKey);

	if (!data) return;

	const bcv = data.data.bcv;
	const paralelo = data.data.paralelo;

	useEffect(() => {
		if (isOpen && usdInputRef.current) {
			setTimeout(() => {
				usdInputRef.current?.focus();
			}, 100);
		}
	}, [isOpen]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (data) {
			updateValues();
		}
	}, [data, usdAmount, bsAmount, lastEdited, currency]);

	const getRate = (): number => {
		if (!data) return 0;

		if (currency === "bcv") {
			return bcv.price;
		}
		if (currency === "paralelo") {
			return paralelo.price;
		}

		if (currency === "custom") {
			return Number(customPromedio?.price);
		}
		// Promedio
		return (bcv.price + paralelo.price) / 2;
	};

	const updateValues = () => {
		const rate = getRate();

		if (lastEdited === "usd") {
			const numAmount = Number.parseFloat(usdAmount) || 0;
			setBsAmount((numAmount * rate).toFixed(2));
		} else {
			const numAmount = Number.parseFloat(bsAmount) || 0;
			setUsdAmount((numAmount / rate).toFixed(2));
		}
	};

	const handleUsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUsdAmount(e.target.value);
		setLastEdited("usd");
	};

	const handleBsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setBsAmount(e.target.value);
		setLastEdited("bs");
	};

	const handleUsdFocus = () => {
		setUsdAmount("");
		setLastEdited("usd");
	};

	const handleBsFocus = () => {
		setBsAmount("");
		setLastEdited("bs");
	};

	const clearUsd = () => {
		setUsdAmount("");
		setLastEdited("usd");
		if (usdInputRef.current) {
			usdInputRef.current.focus();
		}
	};

	const clearBs = () => {
		setBsAmount("");
		setLastEdited("bs");
		if (bsInputRef.current) {
			bsInputRef.current.focus();
		}
	};

	const handleCopyUsd = () => {
		navigator.clipboard.writeText(usdAmount);
		setCopiedUsd(true);
		setTimeout(() => setCopiedUsd(false), 2000);
	};

	const handleCopyBs = () => {
		navigator.clipboard.writeText(bsAmount);
		setCopiedBs(true);
		setTimeout(() => setCopiedBs(false), 2000);
	};

	const swapValues = () => {
		// Intercambiar los valores entre USD y Bs
		const tempUsd = usdAmount;
		const tempBs = bsAmount;

		setUsdAmount(tempBs);
		setBsAmount(tempUsd);

		// Cambiar el foco al campo opuesto
		if (lastEdited === "usd") {
			setLastEdited("bs");
			if (bsInputRef.current) {
				bsInputRef.current.focus();
			}
		} else {
			setLastEdited("usd");
			if (usdInputRef.current) {
				usdInputRef.current.focus();
			}
		}
	};

	// const getCurrencyName = () => {
	// 	switch (currency) {
	// 		case "bcv":
	// 			return "BCV";
	// 		case "paralelo":
	// 			return "Paralelo";
	// 		case "promedio":
	// 			return "Promedio";
	// 		default:
	// 			return "";
	// 	}
	// };

	return (
		<ResponsiveDialog open={isOpen} onOpenChange={onClose}>
			<DialogTitle className="hidden">test</DialogTitle>
			<div className="p-5">
				<div className="mb-4">
					<div className="flex items-center justify-between mb-2">
						<Label>Dólares (USD)</Label>
						<Button
							size="icon"
							onClick={handleCopyUsd}
							className=""
							aria-label="Copiar Tasa"
						>
							{copiedUsd ? (
								<CheckIcon className="h-4 w-4 mr-1" />
							) : (
								<CopyIcon className="h-4 w-4 mr-1" />
							)}
						</Button>
					</div>
					<div className="relative">
						<Input
							ref={usdInputRef}
							type="number"
							value={usdAmount}
							onChange={handleUsdChange}
							onFocus={handleUsdFocus}
							className="pr-16"
							placeholder="Ingrese monto en USD"
							min="0"
							step="any"
						/>
						<div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
							{usdAmount && (
								<button
									type="button"
									onClick={clearUsd}
									className="text-foreground/60 hover:text-foreground transition-colors"
									aria-label="Limpiar Valores"
								>
									<XCircleIcon className="h-5 w-5" />
								</button>
							)}
							<span className="text-foreground/60 ml-1">$</span>
						</div>
					</div>
				</div>

				<div className="flex justify-center my-3 relative">
					<div className="absolute left-0 top-1/2 -translate-y-1/2 text-xs text-foreground/60">
						{lastEdited === "usd" ? "USD → Bs" : "Bs → USD"}
					</div>

					<Button
						size="icon"
						onClick={swapValues}
						className="rounded-full"
						title="Intercambiar valores"
						aria-label="Intercambiar valores"
					>
						<ArrowDownUpIcon className="h-5 w-5" />
						<span className="sr-only">Intercambiar valores</span>
					</Button>
				</div>

				<div className="mb-4">
					<div className="flex items-center justify-between mb-2">
						<Label>Bolívares (Bs.)</Label>
						<Button
							size="icon"
							onClick={handleCopyBs}
							className=""
							aria-label="Copiar Tasa"
						>
							{copiedBs ? (
								<CheckIcon className="h-4 w-4 mr-1" />
							) : (
								<CopyIcon className="h-4 w-4 mr-1" />
							)}
						</Button>
					</div>
					<div className="relative">
						<Input
							ref={bsInputRef}
							type="number"
							value={bsAmount}
							onChange={handleBsChange}
							onFocus={handleBsFocus}
							className="pr-16"
							placeholder="Ingrese monto en Bs."
							min="0"
							step="any"
						/>
						<div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
							{bsAmount && (
								<button
									type="button"
									onClick={clearBs}
									className="text-foreground/60 hover:text-foreground transition-colors"
									aria-label="Limpiar Valores"
								>
									<XCircleIcon className="h-5 w-5" />
								</button>
							)}
							<span className="text-foreground/60 ml-1">Bs.</span>
						</div>
					</div>
				</div>

				<div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 text-sm rounded-lg">
					<p>Tasa de cambio: 1 USD = {formatCurrency(getRate())} Bs.</p>
				</div>
			</div>
		</ResponsiveDialog>
	);
}
