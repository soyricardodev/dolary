import {
	createCurrency,
	createMonitor,
	createMonitors,
	createPage,
	getMonitorByKey,
	getMonitors,
	isExistCurrency,
	isExistMonitor,
	isExistPage,
	updateMonitor,
} from "@/db/queries";
import type { Monitor, Page } from "./types";

export class Provider {
	provider: Page;
	currency: string;
	monitorData: Monitor[];
	pageId!: number;
	currencyId!: number;

	constructor(provider: Page, currency: string, monitorData: Monitor[]) {
		this.provider = provider;
		this.currency = currency;
		this.monitorData = monitorData;

		this.initialize();
	}

	async initialize() {
		const pageExists = await isExistPage(this.provider.name);
		if (pageExists == null) {
			this.pageId = await createPage(
				this.provider.name,
				this.provider.provider,
			);
		} else {
			this.pageId = pageExists.id;
		}

		const currencyExists = await isExistCurrency(this.currency);
		if (currencyExists == null) {
			this.currencyId = await createCurrency(this.currency);
		} else {
			this.currencyId = currencyExists.id;
		}
	}

	async _loadData() {
		const monitorExists = await isExistMonitor(this.pageId, this.currencyId);
		if (!monitorExists) {
			await createMonitors(
				this.monitorData.map((monitor) => ({
					...monitor,
					idPage: this.pageId,
					idCurrency: this.currencyId,
					lastUpdate: new Date(),
				})),
			);
		} else {
			for (const monitor of this.monitorData) {
				const exists = await isExistMonitor(this.pageId, this.currencyId);
				if (!exists) {
					await createMonitor({
						...monitor,
						idPage: this.pageId,
						idCurrency: this.currencyId,
						lastUpdate: new Date(),
					});
				} else {
					const oldMonitor = await getMonitorByKey(monitor.key);
					await updateMonitor({
						...oldMonitor,
						idPage: this.pageId,
						idCurrency: this.currencyId,
					});
				}
			}
		}
	}

	async getListMonitors() {
		await this._loadData();
		return await getMonitors(this.pageId, this.currencyId);
	}
}

export default Provider;
