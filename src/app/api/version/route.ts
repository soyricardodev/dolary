export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET() {
	return Response.json({
		version: process.env.NEXT_PUBLIC_BUILD_ID || null,
		commit_sha: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || null,
	});
}
