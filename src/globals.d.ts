export {};

declare global {
	interface BeforeInstallPromptEvent extends Event {
		readonly platforms: string[];
		readonly userChoice: Promise<{
			outcome: "accepted" | "dismissed";
			platform: string;
		}>;
		prompt(): Promise<void>;
	}
}

declare global {
	interface WindowEventMap extends Record<string, Event> {
		beforeinstallprompt: BeforeInstallPromptEvent;
		appinstalled: Event; // Add the appinstalled event type
	}

	interface Navigator extends Navigator {
		standalone: boolean | undefined; // Indicates if the app is in standalone mode
	}

	interface Window extends Window {
		deferredPrompt: BeforeInstallPromptEvent; // Used to fix the @ts-ignore error
	}
}
