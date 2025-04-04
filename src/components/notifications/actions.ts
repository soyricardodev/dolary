"use server";

import webpush from "web-push";
import {
	createNotificationSubscription,
	getSubscriptions,
	unsubscribeNotification,
} from "./queries";

webpush.setVapidDetails(
	"mailto:soyricardodev@proton.me",
	process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "",
	process.env.VAPID_PRIVATE_KEY ?? "",
);

let subscription: webpush.PushSubscription | null = null;

export async function subscribeUser(sub: PushSubscription) {
	const newSubscription = await createNotificationSubscription(sub);

	if (!newSubscription) {
		console.log("Failed to create subscription in the database");
		return;
	}

	subscription = {
		...newSubscription,
		keys: {
			auth: newSubscription?.auth,
			p256dh: newSubscription?.p256dh,
		},
	};

	return { success: true };
}

export async function unsubscribeUser(sub: PushSubscription) {
	await unsubscribeNotification(sub.endpoint);

	subscription = null;
	// In a production environment, you would want to remove the subscription from the database
	// For example: await db.subscriptions.delete({ where: { ... } })
	return { success: true };
}

export async function sendNotification(message: string) {
	if (!subscription) {
		throw new Error("No subscription available");
	}

	try {
		await webpush.sendNotification(
			subscription,
			JSON.stringify({
				title: "Dolary - Calculadora del Dolar Venezuela",
				body: message,
				icon: "/icon-48x48.png",
				badge: "/icon-48x48.png",
			}),
		);
		return { success: true };
	} catch (error) {
		console.error("Error sending push notification:", error);
		return { success: false, error: "Failed to send notification" };
	}
}

export async function sendNotificationToAllUsers(message: string) {
	const subscriptions = await getSubscriptions();

	const notificationPromises = subscriptions.map(async (sub) => {
		try {
			console.log("Sending notification to:", sub.endpoint);
			await webpush.sendNotification(
				sub,
				JSON.stringify({
					title: "Dolary - Calculadora del Dolar Venezuela",
					body: message,
					icon: "/icon-48x48.png",
					badge: "/icon-48x48.png",
				}),
			);
		} catch (error) {
			console.error(`Error sending notification to ${sub.endpoint}:`, error);
		}
	});

	await Promise.all(notificationPromises);

	return { success: true };
}
