import { NextResponse } from "next/server";
import { getRates } from "@/features/rates/queries";

export const revalidate = 60;

export async function GET() {
	const { data } = await getRates();

	console.log({ data });

	return NextResponse.json({
		data: {
			bcv: data.bcv,
			paralelo: data.paralelo,
			euro: data.euro,
		},
	});
}
