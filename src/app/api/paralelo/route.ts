import { DateTime } from "luxon";
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";
import { getUrlImage } from "../utils";
import { PROVIDERS } from "../consts";
import type { Rate } from "../types";

const PATTERN = /(🗓|🕒|💵|🔺|🔻|🟰)|Bs\. (\d+,\d+)/g;
const validEmojis = ["🗓", "🕒", "💵", "🔺", "🔻", "🟰"];

function getFormattedDate(dateString: string) {
	const date = DateTime.fromISO(dateString, { zone: "America/Caracas" });
	return date.toISO(); // Return in ISO format
}

export async function getParalelo(): Promise<Rate | null> {
	const response = await fetch(PROVIDERS.paralelo.provider);
	const text = await response.text();
	const $ = cheerio.load(text);

	const widgetMessages = $(
		"div.tgme_widget_message_wrap.js-widget_message_wrap",
	);

	const lastOccurrences: Rate[] = [];

	widgetMessages.each((_, widget) => {
		const message = $(widget).find(
			"div.tgme_widget_message.text_not_supported_wrap.js-widget_message",
		);

		if (message.length === 0) return;

		const dataMessage = message.find("div.tgme_widget_message_bubble");
		const textMessage = dataMessage.find(
			"div.tgme_widget_message_text.js-message_text",
		);

		if (textMessage.length === 0) return;

		const result = textMessage.text().trim().match(PATTERN);
		if (result && isValidMessage(result)) {
			const price = extractPrice(result);
			if (price !== null) {
				const lastUpdate = getFormattedDate(getDateMessage(dataMessage));
				const image = getUrlImage("paralelo", "enparalelovzla");

				const data = {
					key: "enparalelovzla",
					title: "EnParaleloVzla",
					price,
					last_update: lastUpdate,
					image,
				};
				lastOccurrences.push(data);
			}
		}
	});

	return lastOccurrences.length > 0
		? lastOccurrences[lastOccurrences.length - 1]
		: null;
}

function isValidMessage(obj: string[]): boolean {
	let emojiCount = 0;
	for (const item of obj) {
		const matches = item.matchAll(PATTERN);
		for (const match of matches) {
			// The emoji will be in the first capturing group ($1) if it matches
			if (match[1] && validEmojis.includes(match[1])) {
				emojiCount++;
			}
		}
	}
	return emojiCount === 4;
}

function extractPrice(obj: string[]): number | null {
	for (const item of obj) {
		const match = item.match(/Bs\. (\d{1,3}(?:\.\d{3})*,\d{2})/);
		if (match?.[1]) {
			const priceString = match[1].replace(/\./g, "").replace(",", ".");
			const price = Number.parseFloat(priceString);
			return Number.isNaN(price) ? null : price; // Ensure it's a valid number
		}
	}
	return null;
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function getDateMessage(dataMessage: cheerio.Cheerio<any>): string {
	return (
		dataMessage
			.find("div.tgme_widget_message_info.short.js-message_info time")
			.attr("datetime") || ""
	);
}

export async function GET() {
	try {
		const data = await getParalelo();
		return NextResponse.json({ ...data });
	} catch (error) {
		return NextResponse.error();
	}
}
