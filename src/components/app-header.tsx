"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrencyData } from "@/hooks/use-currency-data";
import { Logo } from "./logo";
import { PushNotificationManager } from "./notifications/push-notification-manager";
import { revalidateRates } from "./actions";
import PwaInstallPrompt from "./pwa-install-prompt";
import { ShareOnWhatsapp } from "./share-on-whatsapp";

export function AppHeader() {
	const { refetch, isRefetching } = useCurrencyData();

	async function getFreshData() {
		revalidateRates();
		refetch();
	}

	return (
		<header className="flex w-full justify-between items-center">
			<Logo />

			<div className="flex justify-center gap-4">
				<PwaInstallPrompt />
				<ShareOnWhatsapp text="Mira las tasas del Dólar" />
				<PushNotificationManager />
				<Button
					size="icon"
					onClick={() => getFreshData()}
					disabled={isRefetching}
					aria-label="Refrescar Datos"
				>
					<RefreshCw
						className={`h-3.5 w-3.5 mr-1 ${isRefetching ? "animate-spin" : ""}`}
					/>
				</Button>
			</div>
		</header>
	);
}
