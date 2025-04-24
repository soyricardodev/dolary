"use client";

import { RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { PushNotificationManager } from "./notifications/push-notification-manager";
import { revalidateRates } from "./actions";
import PwaInstallPrompt from "./pwa-install-prompt";
import { ShareOnWhatsapp } from "./share-on-whatsapp";
import { ThemeSwitcher } from "./theme-switcher";
import { IOSInstallPrompt } from "./notifications/ios-install-prompt";
import { useState } from "react";

export function AppHeader() {
	const [isUpdating, setIsUpdating] = useState(false);

	async function getFreshData() {
		try {
			// Set updating state to show animation
			setIsUpdating(true);

			// Just use revalidateRates for now
			await revalidateRates();

			// Simulate a minimum update time for better UX
			setTimeout(() => {
				setIsUpdating(false);
			}, 1000);
		} catch (error) {
			console.error("Error refreshing data:", error);
			setIsUpdating(false);
		}
	}

	return (
		<header className="flex w-full justify-between items-center">
			<Logo />

			<div className="flex justify-center gap-2">
				<PwaInstallPrompt />
				<IOSInstallPrompt />
				<PushNotificationManager />
				<ThemeSwitcher />
				<ShareOnWhatsapp text="Mira las tasas del Dólar" />
				<Button
					size="icon"
					onClick={() => getFreshData()}
					disabled={isUpdating}
					aria-label="Refrescar Datos"
					className="size-9 p-0 [&_svg]:size-5 hover:translate-x-[4px]! hover:translate-y-[4px]! hover:shadow-none bg-secondary-background relative"
				>
					<RefreshCwIcon
						className={`h-3.5 w-3.5 mr-1 stroke-foreground ${isUpdating ? "animate-spin" : ""}`}
					/>
				</Button>
			</div>
		</header>
	);
}
