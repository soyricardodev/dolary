import { getDolarBcvData, getParaleloData } from "@/lib/scrapper/get-data";

export async function GET() {
	const { usd: usdParalelo } = await getParaleloData();
	const { usd: usdBcv } = await getDolarBcvData();
	return Response.json([
		{
			name: "paralelo",
			value: usdParalelo,
		},
		{
			name: "bcv",
			value: usdBcv,
		},
	]);
}
