import { BANK_DICT, CURRENCIES, PROVIDERS } from "../consts";
import * as cheerio from "cheerio";
import { getUrlImage } from "../utils";
import { getDateStringToDateTime } from "../date-utils";
import { DateTime } from "luxon";
import type { Rate } from "../types";
import { Redis } from "@upstash/redis";

export async function getBcv() {
	// Disable SSL certificate validation
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

	const response = await fetch(
		PROVIDERS["Banco Central de Venezuela"].provider,
	);
	const text = await response.text();
	const $ = cheerio.load(text);

	const rates: Rate[] = [];

	// Extracting data from the 'table-responsive' section
	const sectionSistemaBancario = $(".table-responsive tbody tr");
	sectionSistemaBancario.each((_index, bank) => {
		const title = $(bank).find(".views-field-views-conditional").text().trim();
		const key = BANK_DICT[title as keyof typeof BANK_DICT]; // Ensuring title is a valid key of BANK_DICT

		if (key && !rates.some((rate) => rate.key === key)) {
			const fieldTasaVenta = $(bank)
				.find(".views-field-field-tasa-venta")
				.text();
			if (fieldTasaVenta.includes(",")) {
				const price = Number.parseFloat(fieldTasaVenta.replace(",", "."));
				const image = getUrlImage("Banco Central de Venezuela", key); // Assuming get_url_image is defined
				const lastUpdate = getDateStringToDateTime(
					$(bank)
						.find(".views-field-field-fecha-del-indicador")
						.text()
						.trim()
						.replace("-", "/"),
				).toISO();

				rates.push({
					key,
					title,
					price,
					image,
					last_update: lastUpdate,
				});
			}
		}
	});

	const sectionTipoDeCambioOficialLastUpdate = $(
		"div .view-tipo-de-cambio-oficial-del-bcv span.date-display-single",
	)
		.text()
		.replace(/\s{2,}(\d{4})$/, " $1");

	const parsedDate = DateTime.fromFormat(
		sectionTipoDeCambioOficialLastUpdate,
		"cccc, dd MMMM yyyy",
		{
			locale: "es",
		},
	);

	// Extracting currency rates
	for (const [code, values] of Object.entries(CURRENCIES)) {
		// Assuming currencies is defined
		const image = getUrlImage("Banco Central de Venezuela", code); // Assuming get_url_image is defined
		rates.push({
			key: code,
			title: values.name,
			price: Number.parseFloat(
				$(`#${values.id} strong`).text().trim().replace(",", "."),
			),
			image,
			last_update: parsedDate.toISO(), // Assuming _get_time is defined
		});
	}

	return rates;
}

export async function getUsdBcv() {
	const data = await getBcv();

	return data.find((rate) => rate.key === "usd");
}

const redis = Redis.fromEnv();

export async function GET() {
	const data = await redis.get("bcv");

	return Response.json({
		data,
	});
}
