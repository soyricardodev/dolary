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

	const result = await db.transaction(async (trx) => {
		// Check if the endpoint already exists
		const existingSubscription = await trx
			.select()
			.from(notificationTable)
			.where(eq(notificationTable.endpoint, endpoint))
			.limit(1);

		if (existingSubscription.length > 0) {
			console.log("Endpoint already exists, updating subscription");
			const [updatedSubscription] = await trx
				.update(notificationTable)
				.set({
					expirationTime,
					auth: authKeyString,
					p256dh: p256dhKeyString,
					isActive: true,
				})
				.where(eq(notificationTable.endpoint, endpoint))
				.returning();
			return updatedSubscription;
		}

		// Insert the new subscription
		const [subscription] = await trx
			.insert(notificationTable)
			.values({
				endpoint,
				expirationTime,
				auth: authKeyString,
				p256dh: p256dhKeyString,
			})
			.returning();

		return subscription;
	});

	return result;
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
