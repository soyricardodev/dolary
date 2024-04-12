import { sql } from "@vercel/postgres";

export async function POST(request: Request) {
	const client = await sql.connect();
	const { message } = await request.json();
	await client.sql`CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL
  )`;
	await client.sql`INSERT INTO feedback (message) VALUES (${message})`;
	return Response.json({ message: "Sugerencia enviada", status: 200 });
}
