import { getBcvData, getParaleloData } from "@/lib/scrapper/get-data";

export async function GET() {
	const { usd: usdParalelo } = await getParaleloData();
	const { usd: usdBcv, eur, yuan, lira, rublo } = await getBcvData();

	return Response.json({
		data: [
			{
				name: "paralelo",
				value: usdParalelo,
			},
			{
				name: "bcv",
				value: usdBcv,
			},
			{
				name: "eur",
				value: eur,
			},
			{
				name: "yuan",
				value: yuan,
			},
			{
				name: "lira",
				value: lira,
			},
			{
				name: "rublo",
				value: rublo,
			},
		],
	});
}
