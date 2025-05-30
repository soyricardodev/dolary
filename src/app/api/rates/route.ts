import { NextResponse } from "next/server";
import { getRates } from "@/features/rates/queries";

export const revalidate = 60;

export async function GET() {
	const { data } = await getRates();

	return NextResponse.json(
		{
			data: {
				bcv: data.bcv,
				euro: data.euro,
				paralelo: data.paralelo
			},
		},
		{
			headers: {
				"Cache-Control": "public, max-age=60",
			},
		},
	);
}
