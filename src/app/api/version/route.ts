export const dynamic = "force-dynamic";

export async function GET() {
	console.log(process.env);

	return Response.json({
		version: process.env.NEXT_PUBLIC_BUILD_ID || null,
		commit_sha: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || null,
	});
}
