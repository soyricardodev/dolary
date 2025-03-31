"use client";

import { useState, useEffect } from "react";
import { subscribeUser, unsubscribeUser } from "./actions";
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

	useEffect(() => {
		if ("serviceWorker" in navigator && "PushManager" in window) {
			setIsSupported(true);
			registerServiceWorker();
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
	}

	async function unsubscribeFromPush() {
		await subscription?.unsubscribe();
		setSubscription(null);
		await unsubscribeUser();
	}

	if (!isSupported) {
		return null;
	}

	return (
		<Dialog>
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
				<DialogDescription>
					{subscription ? (
						<div className="flex flex-col gap-4">
							<p className="text-sm">
								Actualmente estás suscrito para recibir notificaciones sobre las
								tasas del dólar.
							</p>
							<Button onClick={unsubscribeFromPush}>
								Dejar de Recibir Notificaciones
							</Button>
						</div>
					) : (
						<div className="flex flex-col gap-4 text-center">
							<p className="text-sm">
								No estás suscrito a las notificaciones. Suscríbete para recibir
								actualizaciones.
							</p>
							<Button onClick={subscribeToPush}>Recibir Notificaciones</Button>
						</div>
					)}
				</DialogDescription>
			</DialogContent>
		</Dialog>
	);
}
