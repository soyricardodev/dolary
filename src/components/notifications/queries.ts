import { db } from "@/db/db";
import { notificationTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createNotificationSubscription(input: PushSubscription) {
	const { endpoint, expirationTime } = input;

	const subscriptionKeys = input as PushSubscription & {
		keys: { auth: string; p256dh: string };
	};
	const authKeyString = subscriptionKeys.keys.auth;
	const p256dhKeyString = subscriptionKeys.keys.p256dh;

	if (!authKeyString || !p256dhKeyString) {
		console.log("Missing keys in subscription");
		return;
	}

	const [subscription] = await db
		.insert(notificationTable)
		.values({
			endpoint,
			expirationTime,
			auth: authKeyString,
			p256dh: p256dhKeyString,
		})
		.returning();

	return subscription;
}

export async function unsubscribeNotification(endpoint: string) {
	await db
		.update(notificationTable)
		.set({ isActive: false })
		.where(eq(notificationTable.endpoint, endpoint));
}

export async function getSubscriptions() {
	const subscriptions = await db
		.select()
		.from(notificationTable)
		.where(eq(notificationTable.isActive, true));
	return subscriptions.map((subscription) => {
		return {
			endpoint: subscription.endpoint,
			expirationTime: subscription.expirationTime,
			keys: {
				auth: subscription.auth,
				p256dh: subscription.p256dh,
			},
		};
	});
}
