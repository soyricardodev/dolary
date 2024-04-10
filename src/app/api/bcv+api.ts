import { getBcvData } from "../lib/scrapper/get-data";

export async function GET() {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

	const { usd, eur, yuan, lira, rublo } = await getBcvData();

	return Response.json({
		usd,
		eur,
		yuan,
		lira,
		rublo,
	});
}