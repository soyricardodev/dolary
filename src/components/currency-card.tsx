"use client";

import type React from "react";

import { useState } from "react";
import { ArrowDownIcon, ArrowUpIcon, CopyIcon, CheckIcon } from "lucide-react";
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
	subtitle?: React.ReactNode;
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
	subtitle,
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
					<div className="flex flex-col">
						<h2 className="text-xl font-bold">{title}</h2>
						
					</div>
					{
						<Badge className="w-max" variant={"neutral"}>
							{isChangePositive ? (
								<ArrowUpIcon className="size-3 mr-1" />
							) : (
								<ArrowDownIcon className="size-3 mr-1" />
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
						<CheckIcon className="h-4 w-4" />
					) : (
						<CopyIcon className="h-4 w-4" />
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
					{lastUpdate != null ? lastUpdate : null}
					{subtitle && (
							<p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
								{subtitle}
							</p>
						)}
				</div>

				<Button size="sm" variant="neutral">
					Calcular
				</Button>
			</CardFooter>
		</Card>
	);
}
