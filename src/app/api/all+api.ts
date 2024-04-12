import { getBcvData, getParaleloData } from "@/lib/scrapper/get-data";

export async function GET() {
	const { usd: usdParalelo } = await getParaleloData();
	const { usd: usdBcv, eur, yuan } = await getBcvData();

	return Response.json({
		data: [
			{
				label: "Paralelo",
				name: "BS/USD",
				currency: "USD",
				value: usdParalelo,
				color: "rgb(34 197 94)"
			},
			{
				label: "BCV",
				name: "BS/USD",
				currency: "USD",
				value: usdBcv,
				color: "rgb(234 179 8)"
			},
			{
				label: "Euro",
				name: "BS/EUR",
				currency: "EUR",
				value: eur,
				color: "rgb(59 130 246)"
			},
			{
				label: "Yuan",
				name: "BS/CNY",
				currency: "CNY",
				value: yuan,
				color: "rgb(225 29 72)"
			}
		],
	});
}
