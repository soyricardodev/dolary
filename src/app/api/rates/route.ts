import { NextResponse } from "next/server";
import { getBcv } from "../bcv/route";
import { getParalelo } from "../paralelo/route";

export async function GET() {
	const bcvData = getBcv();
	const paraleloData = getParalelo();

	const [bcv, paralelo] = await Promise.all([bcvData, paraleloData]);

	const data = [...bcv, ...paralelo];

	return NextResponse.json({ data });
}
