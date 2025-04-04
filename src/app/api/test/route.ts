import { sendNotificationToAllUsers } from "@/components/notifications/actions";
import { NextResponse } from "next/server";

export async function GET() {
	const direction = "subió";
	const notificationMessage = `La tasa Paralelo ${direction} a 150. Cambio:  2.5 (1.1%).`;

	await sendNotificationToAllUsers(notificationMessage);

	return NextResponse.json({
		notificationMessage,
	});
}
