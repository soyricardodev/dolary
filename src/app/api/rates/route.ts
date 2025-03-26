import { NextResponse } from "next/server";
import { getUsdBcv } from "../bcv/route";
import { getParalelo } from "../paralelo/route";

export const revalidate = 30;

export async function GET() {
	const bcvData = getUsdBcv();
	const paraleloData = getParalelo();

	const [bcv, paralelo] = await Promise.all([bcvData, paraleloData]);

	return NextResponse.json({
		data: {
			bcv,
			paralelo,
		},
	});
}
