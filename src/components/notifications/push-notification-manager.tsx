"use client";

import { useState, useEffect } from "react";
import { subscribeUser, unsubscribeUser } from "./actions";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { BellIcon } from "lucide-react";
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
		<Popover>
			<PopoverTrigger asChild>
				<Button size="icon">
					<BellIcon className="size-5" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="text-mtext">
				{subscription ? (
					<div className="flex justify-center gap-2 flex-col">
						<p>Recibiras notificaciones de las tasas del dolar.</p>
						<Button onClick={unsubscribeFromPush} variant="neutral">
							Dejar de Recibir Notificaciones
						</Button>
					</div>
				) : (
					<div className="flex justify-center gap-2 flex-col">
						<p>No estas suscrito a las notificaciones.</p>
						<Button onClick={subscribeToPush} variant="neutral">
							Recibir Notificaciones
						</Button>
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
