export function GET(request: Request) {
  return Response.json({
    VERCEL_DEPLOYMENT_ID: process.env.VERCEL_DEPLOYMENT_ID,
  })
}