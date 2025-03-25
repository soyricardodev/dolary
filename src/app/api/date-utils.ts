import { DateTime } from "luxon";

const standardTimeZone = "America/Caracas";

export function getDateStringToDateTime(dateString: string): DateTime {
	/**
	 * Format string to DateTime.
	 */
	const now = DateTime.now().setZone(standardTimeZone);
	try {
		return DateTime.fromFormat(dateString, "dd/MM/yyyy, hh:mm a", {
			zone: standardTimeZone,
		});
	} catch {
		return DateTime.fromFormat(dateString, "dd/MM/yyyy", {
			zone: standardTimeZone,
		}).setZone(standardTimeZone);
	}
}

export function getFormattedTimestamp(dateTimestampMs: number): DateTime {
	/**
	 * Format milliseconds to DateTime.
	 */
	const timestampS = dateTimestampMs / 1000;
	return DateTime.fromSeconds(timestampS, { zone: standardTimeZone });
}

export function getFormattedDateBcv(dateString: string): DateTime {
	/**
	 * Format ISO date string to DateTime.
	 */
	return DateTime.fromISO(dateString, { zone: standardTimeZone });
}

export function getFormattedDate(dateString: string): DateTime {
	/**
	 * Format ISO date string to DateTime.
	 */
	return DateTime.fromISO(dateString, { zone: standardTimeZone });
}

export function getFormattedDateTz(dateString: string): DateTime {
	/**
	 * Format datetime from UTC.
	 */
	const dt = DateTime.fromISO(dateString, { zone: "utc" });
	return dt.setZone(standardTimeZone);
}

export function getTime(dateString: string): DateTime {
	/**
	 * Format datetime.
	 */
	return DateTime.fromFormat(dateString, "yyyy-MM-dd HH:mm", {
		zone: standardTimeZone,
	});
}

export function getTimeZone(): { date: string; time: string } {
	/**
	 * Get the current time in Venezuela.
	 */
	const now = DateTime.now().setZone(standardTimeZone);
	const formattedDate = now.toFormat("cccc", { locale: "es" });
	const formattedTime = now.toFormat("h:mm:ss a", { locale: "es" });

	return {
		date: formattedDate,
		time: formattedTime,
	};
}
