import { sendNotificationToAllUsers } from "@/components/notifications/actions";

export async function POST() {
	try {
		await sendNotificationToAllUsers(
			"Por favor, actualiza Dolary para obtener la última versión.",
		);

		return Response.json({ success: true });
	} catch (error) {
		return Response.json(
			{ success: false, error: "Error al enviar notificaciones" },
			{ status: 500 },
		);
	}
}
