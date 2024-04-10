import { getParaleloData } from "@/lib/scrapper/get-data";

export async function GET() {
	const { usd } = await getParaleloData();
	return Response.json({
		usd,
	});
}
