import { kv } from '@vercel/kv';

export async function GET() {
	const dataFromStorage = await kv.get("currencies")

	return Response.json({
		dataFromStorage
	});
}
