import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, toZonedTime } from "date-fns-tz";
import { es } from "date-fns/locale/es";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatCurrency(
	num: number,
	locale = "es-VE",
	digits = 2,
): string {
	return new Intl.NumberFormat(locale, {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits,
	}).format(num);
}

// Function to get Venezuela time
export function getVenezuelaTime(): Date {
	const now = new Date();
	// Venezuela is UTC-4
	return new Date(now.getTime() - 4 * 60 * 60 * 1000);
}

// Function to check if we should refetch based on Venezuela time
export function shouldRefetch(): boolean {
	const venezuelaTime = getVenezuelaTime();
	const day = venezuelaTime.getDay();
	const hour = venezuelaTime.getHours();

	// Only refetch on weekdays (Monday-Friday)
	if (day === 0 || day === 6) return false;

	// BCV updates around 3-4pm
	const isBcvUpdateTime = hour >= 15 && hour < 16;

	// Paralelo updates around 9am and 1pm
	const isParaleloMorningUpdateTime = hour >= 9 && hour < 10;
	const isParaleloAfternoonUpdateTime = hour >= 13 && hour < 14;

	return (
		isBcvUpdateTime ||
		isParaleloMorningUpdateTime ||
		isParaleloAfternoonUpdateTime
	);
}

/**
 * Formats a date string (ISO or Date) to Venezuela time, Spanish locale.
 * @param dateInput - ISO string, Date, or number
 * @param opts - { withTime?: boolean, prefix?: string }
 * @returns string like 'Vigente para: Miércoles 16/04/2025' or 'Actualizado: Miércoles 16/04/2025 08:00 AM'
 */
export function formatVenezuelaDate(
	dateInput: string | Date | number,
	opts?: { withTime?: boolean; prefix?: string },
): string {
	const timeZone = "America/Caracas";
	let date = toZonedTime(dateInput, timeZone);
	// TEMPORARY WORKAROUND: If the date is exactly at 00:00:00 UTC, add 4 hours so Venezuela sees the correct day
	if (typeof dateInput === "string" && /T00:00:00(.000)?Z$/.test(dateInput)) {
		date = new Date(date.getTime() + 4 * 60 * 60 * 1000);
	}
	const dateFormat = "EEEE dd/MM/yyyy";
	const timeFormat = "hh:mm a";
	let formatted = format(date, dateFormat, { timeZone, locale: es });
	// Capitalize first letter
	formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
	if (opts?.withTime) {
		formatted += " " + format(date, timeFormat, { timeZone, locale: es });
	}
	if (opts?.prefix) {
		formatted = opts.prefix + formatted;
	}
	return formatted;
}
