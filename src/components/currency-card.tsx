"use client";

import type React from "react";

import { useState } from "react";
import { ArrowDown, ArrowUp, Copy, Check } from "lucide-react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export interface CurrencyCardProps {
	title: string;
	price: number;
	symbol?: string;
	change?: number;
	percent?: number;
	color?: string;
	lastUpdate?: string;
	onClick?: () => void;
	className?: string;
}

export function CurrencyCard({
	title,
	price,
	symbol,
	change,
	percent,
	lastUpdate,
	onClick,
	className = "",
	color,
}: CurrencyCardProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = (e: React.MouseEvent) => {
		e.stopPropagation();
		navigator.clipboard.writeText(price.toString());
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const isChangePositive = color != null && color === "green";

	return (
		<Card className={`relative ${className}`} onClick={onClick}>
			<CardHeader className="pt-2 pb-0 flex flex-row w-full justify-between items-center">
				<div className="flex gap-4">
					<h2 className="text-xl font-bold">{title}</h2>
					{
						<Badge className="w-max" variant={"neutral"}>
							{isChangePositive ? (
								<ArrowUp className="size-3 mr-1" />
							) : (
								<ArrowDown className="size-3 mr-1" />
							)}

							<span className="font-medium">
								{isChangePositive ? "+" : "-"}
								{formatCurrency(change ?? 0)} ({(percent ?? 0).toFixed(2)}%)
							</span>
						</Badge>
					}
				</div>
				<Button
					onClick={handleCopy}
					title="Copiar valor"
					size="icon"
					aria-label="Copiar Tasa"
				>
					{copied ? (
						<Check className="h-4 w-4" />
					) : (
						<Copy className="h-4 w-4" />
					)}
				</Button>
			</CardHeader>
			<CardContent className="py-0">
				<div className="relative h-full flex flex-col">
					<div className="flex items-baseline mb-1">
						<span className="text-3xl font-bold">{formatCurrency(price)}</span>
						{symbol != null && <span className="ml-1 text-xs">{symbol}</span>}
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex items-center justify-between pb-3 -mt-5">
				<div className="mt-auto text-xs">
					{lastUpdate != null ? `Actualizado: ${lastUpdate}` : null}
				</div>

				<Button size="sm" variant="neutral">
					Calcular
				</Button>
			</CardFooter>
		</Card>
	);
}
