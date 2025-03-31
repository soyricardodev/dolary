export interface Rate {
	key: string;
	title: string;
	price: number;
	image: string | null;
	last_update: string | null;
}

export interface Page {
	name: string;
	provider: string;
	currencies: string[];
}

export interface Monitor {
	key: string;
	title: string;
	price: number;
	price_old?: number;
	last_update?: string | Date;
	image?: string;
	percent?: number;
	change?: number;
	color?: string;
	symbol?: string;
}

export interface Image {
	title: string;
	image: string;
	provider: string;
}
