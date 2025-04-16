"use client";

import type React from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilIcon, CopyIcon } from "lucide-react";

export function SkeletonCustomCurrencyCard() {
	return (
		<Card>
			<CardHeader className="pb-0 flex flex-row w-full justify-between items-center">
				<div className="flex gap-4">
					<div className="h-6 w-32 bg-muted rounded animate-pulse" />
				</div>
				<div className="flex items-center gap-4">
					<Button size="icon" disabled title="Editar">
						<PencilIcon className="h-4 w-4" />
					</Button>
					<Button size="icon" disabled title="Copiar valor">
						<CopyIcon className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent className="py-0">
				<div className="relative h-full flex flex-col">
					<div className="flex items-baseline mb-1">
						<div className="h-10 w-36 bg-muted rounded animate-pulse" />
					</div>
				</div>
			</CardContent>
			<CardFooter className="flex items-center justify-between pb-3 -mt-5">
				<div />
				<Button size="sm" variant="neutral" disabled>
					Calcular
				</Button>
			</CardFooter>
		</Card>
	);
}
