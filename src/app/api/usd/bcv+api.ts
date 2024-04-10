import { getDolarBcvData } from "@/app/lib/scrapper/get-data";

export async function GET() {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

	const { usd } = await getDolarBcvData();

	return Response.json({
		usd,
	});
}