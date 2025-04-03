"use client";

import { useState, useEffect } from "react";
import { sendNotification, subscribeUser, unsubscribeUser } from "./actions";
import { Button } from "../ui/button";
import { BellIcon } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "../ui/checkbox";

function urlBase64ToUint8Array(base64String: string) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

export function PushNotificationManager() {
	const [isSupported, setIsSupported] = useState(false);
	const [subscription, setSubscription] = useState<PushSubscription | null>(
		null,
	);

	const [isOpen, setIsOpen] = useState(false);
	const [dontRemind, setDontRemind] = useState(false);

	useEffect(() => {
		if ("serviceWorker" in navigator && "PushManager" in window) {
			setIsSupported(true);
			registerServiceWorker();
		}

		// Check localStorage for the "iWantNotifications" and "dontRemindNotifications" keys
		const wantsNotifications = localStorage.getItem("iWantNotifications");
		const dontRemindNotifications = localStorage.getItem(
			"dontRemindNotifications",
		);

		if (dontRemindNotifications) {
			setDontRemind(true);
		}

		if (!wantsNotifications && !dontRemindNotifications) {
			setTimeout(() => {
				setIsOpen(true); // Open the dialog if both keys are not present
			}, 5000);
		}
	}, []);

	async function registerServiceWorker() {
		const registration = await navigator.serviceWorker.register("/sw.js", {
			scope: "/",
			updateViaCache: "none",
		});
		const sub = await registration.pushManager.getSubscription();
		setSubscription(sub);
	}

	async function subscribeToPush() {
		const registration = await navigator.serviceWorker.ready;
		const sub = await registration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey: urlBase64ToUint8Array(
				process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "",
			),
		});
		setSubscription(sub);
		const serializedSub = JSON.parse(JSON.stringify(sub));
		await subscribeUser(serializedSub);
		localStorage.setItem("iWantNotifications", "true");
		await sendNotification(
			"Excelente, ahora recibiras notificaciones de Dolary.",
		);
	}

	async function unsubscribeFromPush() {
		await subscription?.unsubscribe();
		setSubscription(null);
		await unsubscribeUser();
		localStorage.removeItem("iWantNotifications");
	}

	const handleDontRemindChange = (checked: boolean) => {
		setDontRemind(checked);
		if (checked) {
			localStorage.setItem("dontRemindNotifications", "true");
		} else {
			localStorage.removeItem("dontRemindNotifications");
		}
	};

	if (!isSupported) {
		return null;
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size="icon" aria-label="Manage Notifications">
					<BellIcon className="h-5 w-5" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="text-lg font-semibold">
						Notificaciones
					</DialogTitle>
				</DialogHeader>
				<div>
					{subscription ? (
						<div className="flex flex-col gap-4">
							<DialogDescription className="text-sm">
								Actualmente estás suscrito para recibir notificaciones sobre las
								tasas del dólar.
							</DialogDescription>
							<Button onClick={unsubscribeFromPush}>
								Desuscribirme de las notificaciones
							</Button>
						</div>
					) : (
						<div className="flex flex-col gap-4">
							<DialogDescription className="text-sm">
								¿Quieres recibir notificaciones?
							</DialogDescription>
							<Button onClick={subscribeToPush}>
								Subscribirme a las notificaciones
							</Button>
							<div className="flex items-center space-x-2">
								<Checkbox
									id="dont-remind"
									checked={dontRemind}
									onCheckedChange={handleDontRemindChange}
								/>
								<label
									htmlFor="dont-remind"
									className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
								>
									No recordarme activar las notificaciones
								</label>
							</div>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
