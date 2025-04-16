"use client";

import { RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrencyData } from "@/hooks/use-currency-data";
import { Logo } from "./logo";
import { PushNotificationManager } from "./notifications/push-notification-manager";
import { revalidateRates } from "./actions";
import PwaInstallPrompt from "./pwa-install-prompt";
import { ShareOnWhatsapp } from "./share-on-whatsapp";
import { ThemeSwitcher } from "./theme-switcher";
import { IOSInstallPrompt } from "./notifications/ios-install-prompt";

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
				<IOSInstallPrompt />
				<PushNotificationManager />
				<ThemeSwitcher />
				<ShareOnWhatsapp text="Mira las tasas del Dólar" />
				<Button
					size="icon"
					onClick={() => getFreshData()}
					disabled={isRefetching}
					aria-label="Refrescar Datos"
					className="size-9 p-0 [&_svg]:size-5 hover:translate-x-[4px]! hover:translate-y-[4px]! hover:shadow-none bg-secondary-background "
				>
					<RefreshCwIcon
						className={`h-3.5 w-3.5 mr-1 stroke-foreground ${isRefetching ? "animate-spin" : ""}`}
					/>
				</Button>
			</div>
		</header>
	);
}
