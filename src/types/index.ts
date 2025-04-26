import type { Monitor } from "@/app/api/types";

export interface DateTimeInfo {
	date: string;
	time: string;
}

export interface MonitorData {
	change: number;
	color: string;
	image: string;
	last_update: string;
	percent: number;
	price: number;
	price_old: number;
	symbol: string;
	title: string;
}

export interface Monitors {
	bcv: MonitorData;
	enparalelovzla: MonitorData;
	[key: string]: MonitorData;
}

export interface DolarApiResponse {
	datetime: DateTimeInfo;
	monitors: Monitors;
}

export interface RatesResponse {
	data: {
		bcv: Monitor;
		paralelo: Monitor;
		euro?: Monitor;
	};
}

export interface CustomPromedio {
	name: string;
	price: number;
}

export const CustomPromedioKey = "customPromedio";
export const MonitorsKey = "monitors";
export const CalculatorModeKey = "calculatorMode";
export type CalculatorMode = "simple" | "advanced";
