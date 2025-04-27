"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
	useMemo,
} from "react";
import { useCurrencyData } from "@/hooks/use-currency-data";
import type { RatesResponse } from "@/types";

const CUSTOM_CURRENCY_STORAGE_KEY = "customPromedio";

interface PromedioData {
	price: number;
	change: number;
	percent: number;
	color: "red" | "green" | "neutral";
	symbol: string;
}

export interface CustomCurrencyData {
	price: number;
	name?: string;
}

export interface CurrencyContextType {
	data: RatesResponse | null;
	promedio: PromedioData | null;
	custom: CustomCurrencyData | null;
	updateCustomCurrency: (data: CustomCurrencyData | null) => void;
	isLoading: boolean;
	error: unknown;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
	undefined,
);

interface CurrencyProviderProps {
	children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
	const { data: rawData, isLoading, error } = useCurrencyData();
	const [customCurrency, setCustomCurrency] =
		useState<CustomCurrencyData | null>(null);

	useEffect(() => {
		try {
			const customCurrencyLocalStorage = localStorage.getItem(
				CUSTOM_CURRENCY_STORAGE_KEY,
			);
			if (customCurrencyLocalStorage) {
				setCustomCurrency(JSON.parse(customCurrencyLocalStorage));
			}
		} catch (e) {
			console.error("Failed to load custom currency from localStorage:", e);
		}
	}, []);

	const updateCustomCurrency = (newData: CustomCurrencyData | null) => {
		try {
			setCustomCurrency(newData);
			if (newData === null) {
				localStorage.removeItem(CUSTOM_CURRENCY_STORAGE_KEY);
			} else {
				localStorage.setItem(
					CUSTOM_CURRENCY_STORAGE_KEY,
					JSON.stringify(newData),
				);
			}
		} catch (e) {
			console.error(
				"Failed to save/remove custom currency to/from localStorage:",
				e,
			);
		}
	};

	const processedData = useMemo(() => {
		if (!rawData || !rawData.data) return { data: null, promedio: null };

		const bcv = rawData.data.bcv;
		const paralelo = rawData.data.paralelo;
		const bcvPrice = bcv.price;
		const paraleloPrice = paralelo.price;
		const promedioPrice = (bcvPrice + paraleloPrice) / 2;

		const promedioOld = ((bcv.price_old ?? 0) + (paralelo.price_old ?? 0)) / 2;
		const promedioChange = Number.parseFloat(
			(promedioPrice - promedioOld).toFixed(2),
		);
		const promedioPercent = Number.parseFloat(
			((promedioChange / promedioPrice) * 100 || 0).toFixed(2).replace("-", ""),
		);

		const promedioColor =
			promedioPrice < promedioOld
				? "red"
				: promedioPrice > promedioOld
					? "green"
					: "neutral";

		const promedioSymbol =
			promedioColor === "green" ? "▲" : promedioColor === "red" ? "▼" : "";

		const sanitizedChange = Number.parseFloat(
			promedioChange.toString().replace("-", ""),
		);

		const promedio: PromedioData = {
			price: promedioPrice,
			change: sanitizedChange,
			percent: promedioPercent,
			color: promedioColor,
			symbol: promedioSymbol,
		};

		return { data: rawData, promedio };
	}, [rawData]);

	const value = {
		data: processedData.data,
		promedio: processedData.promedio,
		custom: customCurrency,
		updateCustomCurrency,
		isLoading,
		error,
	};

	return (
		<CurrencyContext.Provider value={value}>
			{children}
		</CurrencyContext.Provider>
	);
}

export function useCurrencyContext() {
	const context = useContext(CurrencyContext);
	if (context === undefined) {
		throw new Error(
			"useCurrencyContext must be used within a CurrencyProvider",
		);
	}
	return context;
}
