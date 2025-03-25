CREATE TABLE `dolary_page` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`url` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
ALTER TABLE `dolary_monitor` ADD `id_page` integer NOT NULL REFERENCES dolary_page(id);