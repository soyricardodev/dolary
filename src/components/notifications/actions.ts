"use server";

import webpush from "web-push";

webpush.setVapidDetails(
	"mailto:soyricardodev@proton.me",
	process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "",
	process.env.VAPID_PRIVATE_KEY ?? "",
);

let subscription: webpush.PushSubscription | null = null;

export async function subscribeUser(sub: PushSubscription) {
	subscription = sub;
	// In a production environment, you would want to store the subscription in a database
	// For example: await db.subscriptions.create({ data: sub })
	return { success: true };
}

export async function unsubscribeUser() {
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
