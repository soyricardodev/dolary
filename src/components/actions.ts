"use server";

import { revalidateTag } from "next/cache";

export async function revalidateRates() {
	revalidateTag("rates");
}
