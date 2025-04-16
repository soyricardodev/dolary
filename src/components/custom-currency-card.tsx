"use client";

import type React from "react";

import { useState } from "react";
import { CopyIcon, CheckIcon } from "lucide-react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { CustomPromedioKey, type CustomPromedio } from "@/types";
import { Button } from "./ui/button";
import useLocalStorage from "@/hooks/use-local-storage";
import { AddCustomPromedio } from "./add-custom-promedio";
import { ModifyCustomPromedio } from "./modify-custom-promedio";

export function CustomCurrencyCard({ onClick }: { onClick: () => void }) {
	const [customPromedio] = useLocalStorage<CustomPromedio>(CustomPromedioKey);
	const [copied, setCopied] = useState(false);

	if (!customPromedio) return <AddCustomPromedio />;

	const handleCopy = (e: React.MouseEvent) => {
		e.stopPropagation();
		navigator.clipboard.writeText(customPromedio.price.toString());
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<Card>
			<CardHeader className="pt-2 pb-0 flex flex-row w-full justify-between items-center">
				<div className="flex gap-4">
					<h2 className="text-xl font-bold">{customPromedio?.name}</h2>
				</div>
				<div className="flex items-center gap-4">
					<ModifyCustomPromedio />

					<Button onClick={handleCopy} title="Copiar valor" size="icon">
						{copied ? (
							<CheckIcon className="h-4 w-4" />
						) : (
							<CopyIcon className="h-4 w-4" />
						)}
					</Button>
				</div>
			</CardHeader>
			<CardContent className="py-0">
				<div className="relative h-full flex flex-col">
					<div className="flex items-baseline mb-1">
						<span className="text-3xl font-bold">
							{formatCurrency(customPromedio.price)}
						</span>
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex items-center justify-between pb-3 -mt-5">
				<div />

				<Button size="sm" variant="neutral" onClick={onClick}>
					Calcular
				</Button>
			</CardFooter>
		</Card>
	);
}
