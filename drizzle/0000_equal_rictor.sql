CREATE TABLE `dolary_currency` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`symbol` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `dolary_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`id_monitor` integer NOT NULL,
	`price` real NOT NULL,
	`last_update` integer NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`id_monitor`) REFERENCES `dolary_monitor`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `dolary_monitor` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`id_currency` integer NOT NULL,
	`key` text,
	`title` text NOT NULL,
	`price` real NOT NULL,
	`price_old` real,
	`last_update` integer NOT NULL,
	`image` text,
	`percent` real DEFAULT 0,
	`change` real DEFAULT 0,
	`color` text DEFAULT 'neutral',
	`symbol` text DEFAULT '',
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	FOREIGN KEY (`id_currency`) REFERENCES `dolary_currency`(`id`) ON UPDATE no action ON DELETE no action
);
