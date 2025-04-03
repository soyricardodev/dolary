"use client";

import { Button } from "@/components/ui/button";
import { ArrowRightLeftIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CurrencySelectorProps {
	selectedRateType: string;
	setSelectedRateTypeAction: (value: string) => void;
	conversionMode: "dollarToBs" | "bsToDollar";
	toggleConversionModeAction: () => void;
	rates: {
		bcv: number;
		paralelo: number;
		promedio: number;
	};
}

export function CurrencySelector({
	selectedRateType,
	setSelectedRateTypeAction,
	conversionMode,
	toggleConversionModeAction,
	rates,
}: CurrencySelectorProps) {
	return (
		<div className="bg-yellow-200 p-3 border-black border-2 rounded-md">
			<div className="flex items-center justify-between mb-2">
				<Tabs
					defaultValue="paralelo"
					value={selectedRateType}
					onValueChange={setSelectedRateTypeAction}
					className="w-full"
				>
					<TabsList className="grid grid-cols-3 bg-yellow-100 border-black border-2">
						<TabsTrigger value="bcv" className="data-[state=active]:bg-white">
							BCV
						</TabsTrigger>
						<TabsTrigger
							value="paralelo"
							className="data-[state=active]:bg-white"
						>
							Paralelo
						</TabsTrigger>
						<TabsTrigger
							value="promedio"
							className="data-[state=active]:bg-white"
						>
							Promedio
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<div className="flex items-center justify-between">
				<Button
					onClick={toggleConversionModeAction}
					className="h-10 border-black border-2 bg-white hover:bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 transition-transform active:scale-95"
				>
					<ArrowRightLeftIcon size={16} />
					{conversionMode === "dollarToBs" ? "$ → Bs" : "Bs → $"}
				</Button>

				{/* Hidden inputs for rates - only accessible through settings if needed */}
				<input type="hidden" value={rates.bcv} />
				<input type="hidden" value={rates.paralelo} />
				<input type="hidden" value={rates.promedio} />
			</div>
		</div>
	);
}
