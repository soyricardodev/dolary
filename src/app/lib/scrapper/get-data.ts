import { parse } from "node-html-parser";
import { bcv, paralelo } from "./origins";

async function getWebsiteData(url: string) {
	const data = await fetch(url);
	return await data.text();
}

function extractNumbersAndComma(value: string): number {
	const numbersAndCommaFromString = value.match(/[\d,]+/);

	if (numbersAndCommaFromString) {
		return Number.parseFloat(numbersAndCommaFromString[0].replace(",", "."));
	}

	return 0;
}

async function getBcvData() {
	const data = await getWebsiteData(bcv.url);
	const parsedData = parse(data);

	const usd = extractNumbersAndComma(
		parsedData.querySelector(bcv.sources[0].selector)?.innerHTML ?? "",
	);
	const eur = extractNumbersAndComma(
		parsedData.querySelector(bcv.sources[1].selector)?.innerHTML ?? "",
	);
	const yuan = extractNumbersAndComma(
		parsedData.querySelector(bcv.sources[2].selector)?.innerHTML ?? "",
	);
	const lira = extractNumbersAndComma(
		parsedData.querySelector(bcv.sources[3].selector)?.innerHTML ?? "",
	);
	const rublo = extractNumbersAndComma(
		parsedData.querySelector(bcv.sources[4].selector)?.innerHTML ?? "",
	);

	return {
		usd,
		eur,
		yuan,
		lira,
		rublo,
	};
}

async function getDolarBcvData() {
	const data = await getWebsiteData(bcv.url);
	const parsedData = parse(data);

	const usd = extractNumbersAndComma(
		parsedData.querySelector(bcv.sources[0].selector)?.innerHTML ?? "",
	);

	return {
		usd,
	};
}

async function getParaleloData() {
	const data = await getWebsiteData(paralelo.url);
	const parsedData = parse(data);
	const usd = extractNumbersAndComma(
		parsedData.querySelector(paralelo.sources[0].selector)?.innerHTML ?? "",
	);
	return { usd };
}

export { getBcvData, getDolarBcvData, getParaleloData };
