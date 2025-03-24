"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrencyData } from "@/hooks/use-currency-data";
import Link from "next/link";

export function AppHeader() {
	const { refetch, isRefetching } = useCurrencyData();

	return (
		<header className="flex w-full justify-between items-center">
			<Link
				href="/"
				className="text-[30px] h-11 w-11 rounded-base flex bg-main text-text border-2 border-black items-center justify-center font-heading"
			>
				D
			</Link>

			<div className="flex justify-center">
				<Button size="icon" onClick={() => refetch()} disabled={isRefetching}>
					<RefreshCw
						className={`h-3.5 w-3.5 mr-1 ${isRefetching ? "animate-spin" : ""}`}
					/>
				</Button>
			</div>
		</header>
	);
}
