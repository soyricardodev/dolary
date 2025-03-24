export const edge = true;

export default async function handler(request: Request) {
  return Response.json({
    VERCEL_DEPLOYMENT_ID: process.env.DEPLOYMENT_ID,
  })
}