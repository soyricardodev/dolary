import { DollarSign, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrencyData } from "@/hooks/use-currency-data";

export function AppHeader() {
	const { refetch, isRefetching } = useCurrencyData();

	return (
		<header className="mb-3 text-center flex w-full justify-between items-center">
			<Button>
				<DollarSign className="size-5" />
				<span className="text-xl font-bold">Dolary</span>
			</Button>

			<div className="flex justify-center mt-2">
				<Button size="icon" onClick={() => refetch()} disabled={isRefetching}>
					<RefreshCw
						className={`h-3.5 w-3.5 mr-1 ${isRefetching ? "animate-spin" : ""}`}
					/>
				</Button>
			</div>
		</header>
	);
}
