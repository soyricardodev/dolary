import { PROVIDERS, CURRENCIES, LIST_IMAGES_URL } from "../consts";

type ProviderKey = string; // Adjust this type based on your actual keys in PROVIDERS
type CurrencyKey = string; // Adjust this type based on your actual keys in CURRENCIES

export function getProvider(provider: string): ProviderKey | null {
	/**
	 * Obtains the provider from the list of providers.
	 */
	for (const [key, value] of Object.entries(PROVIDERS)) {
		if (provider.toLowerCase() === value.id.toLowerCase()) {
			return key as ProviderKey;
		}
	}
	return null;
}

export function getCurrency(currency: string): CurrencyKey | null {
	/**
	 * Obtains the currency from the list of currencies.
	 */
	const key = currency.toLowerCase() as keyof typeof CURRENCIES;
	return CURRENCIES[key]?.id || null;
}

export function getUrlImage(
	provider: keyof typeof PROVIDERS,
	monitor: string,
): string | null {
	/**
	 * Obtains the image URL of the provider.
	 */
	for (const obj of LIST_IMAGES_URL) {
		if (
			obj.provider.toLowerCase() === PROVIDERS[provider]?.id.toLowerCase() &&
			obj.title.toLowerCase() === monitor.toLowerCase()
		) {
			return obj.image;
		}
	}
	return null;
}
