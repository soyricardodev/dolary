import { NextResponse } from "next/server";
import { updateAllData } from "../cron/route";

export async function GET() {
	await updateAllData();
	return NextResponse.json({ message: "cool" });
}
