"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const PwaInstallPrompt = () => {
	const [installPromptEvent, setInstallPromptEvent] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [isAppInstalled, setIsAppInstalled] = useState(false);

	useEffect(() => {
		const handler = (event: BeforeInstallPromptEvent) => {
			event.preventDefault();
			console.log("beforeinstallprompt fired");
			setInstallPromptEvent(event);
		};

		const checkIsAppInstalled = () => {
			if (
				window.matchMedia("(display-mode: standalone)").matches ||
				// @ts-ignore
				window.navigator.standalone === true
			) {
				setIsAppInstalled(true);
			}
		};

		window.addEventListener("beforeinstallprompt", handler);

		// Check if already installed on mount
		checkIsAppInstalled();

		// Listen for appinstalled event
		window.addEventListener("appinstalled", () => {
			console.log("PWA was installed");
			setIsAppInstalled(true);
			setInstallPromptEvent(null); // Hide the install button
		});

		return () => {
			window.removeEventListener("beforeinstallprompt", handler);
			window.removeEventListener("appinstalled", () => {
				console.log("PWA was installed");
				setIsAppInstalled(true);
				setInstallPromptEvent(null);
			});
		};
	}, []);

	const handleInstallClick = () => {
		if (!installPromptEvent) return;

		installPromptEvent.prompt();

		installPromptEvent.userChoice.then((choiceResult) => {
			if (choiceResult.outcome === "accepted") {
				console.log("User accepted the A2HS prompt");
			} else {
				console.log("User dismissed the A2HS prompt");
			}
			setInstallPromptEvent(null);
		});
	};

	if (isAppInstalled) {
		return null; // Don't render anything if the app is already installed
	}

	return (
		<div>
			{installPromptEvent && (
				<Button onClick={handleInstallClick} className="h-9">
					Instalar App
				</Button>
			)}
		</div>
	);
};

export default PwaInstallPrompt;
