import { kv } from '@vercel/kv';

export async function GET() {
	const data = await kv.get("currencies")

	return Response.json({
		data
	});
}
