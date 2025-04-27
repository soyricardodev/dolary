"use client";

import type React from "react";

import { useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, CopyIcon, CheckIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useCalculatorContext } from "@/context/calculator-context";

export interface CurrencyCardProps {
	key: string;
	title: string;
	price: number;
	symbol?: string;
	change?: number;
	percent?: number;
	color?: string;
	lastUpdate?: string;
	className?: string;
	subtitle?: React.ReactNode;
	headerActions?: React.ReactNode;
}

export function CurrencyCard({
	key,
	title,
	price,
	symbol,
	change,
	percent,
	lastUpdate,
	className = "",
	color,
	subtitle,
	headerActions,
}: CurrencyCardProps) {
	const [copied, setCopied] = useState(false);

	const { openCalculator } = useCalculatorContext();

	const handleCopy = (e: React.MouseEvent) => {
		e.stopPropagation();
		navigator.clipboard.writeText(price.toString());
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const isChangePositive = color != null && color === "green";

	return (
		<Card className={cn("relative", className)}>
			<CardHeader className="pt-2 pb-0 flex flex-row w-full justify-between space-y-0">
				<div className="flex gap-2 space-y-0">
					<h2
						className="text-lg lg:text-xl font-bold"
						onMouseDown={() => openCalculator(key)}
					>
						{title}
					</h2>
					{change != null && (
						<Badge className="w-fit h-fit px-1" variant={"neutral"}>
							{isChangePositive ? (
								<ArrowUpIcon className="size-3" />
							) : (
								<ArrowDownIcon className="size-3" />
							)}

							<span className="font-medium">
								{isChangePositive ? "+" : "-"}
								{formatCurrency(change ?? 0)} ({(percent ?? 0).toFixed(2)}%)
							</span>
						</Badge>
					)}
				</div>
				<div className="flex items-center gap-1">
					{headerActions}

					<Button
						onClick={handleCopy}
						title="Copiar valor"
						size="icon"
						aria-label="Copiar Tasa"
						className="size-8 p-0 [&_svg]:size-4 hover:translate-x-[4px]! hover:translate-y-[4px]! hover:shadow-none"
						type="button"
					>
						{copied ? (
							<CheckIcon className="h-4 w-4" />
						) : (
							<CopyIcon className="h-4 w-4" />
						)}
					</Button>
				</div>
			</CardHeader>
			<CardContent className="pb-3 flex items-end justify-between">
				<div className="h-full flex flex-col">
					<div className="flex items-baseline mb-1">
						<span className="text-3xl font-bold" onMouseDown={handleCopy}>
							{formatCurrency(price)}
						</span>
						{symbol != null && <span className="ml-1 text-xs">{symbol}</span>}
					</div>
					{lastUpdate != null ? <p className="text-xs">{lastUpdate}</p> : null}
					{subtitle != null ? (
						<span className="text-xs">{subtitle}</span>
					) : null}
				</div>

				<Button
					size="sm"
					variant="neutral"
					type="button"
					className="h-8 px-2"
					onClick={() => openCalculator(key)}
				>
					Calcular
				</Button>
			</CardContent>
		</Card>
	);
}
