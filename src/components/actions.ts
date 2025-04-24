"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function revalidateRates() {
	revalidateTag("rates");
	revalidatePath("/");
}
