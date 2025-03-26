import { NextResponse } from "next/server";
import { updateAllData } from "../_cron/route";

export async function GET() {
	await updateAllData();
	return NextResponse.json({ message: "cool" });
}
