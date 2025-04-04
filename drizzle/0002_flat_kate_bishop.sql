CREATE TABLE `dolary_notification` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`endpoint` text NOT NULL,
	`expiration_time` integer,
	`pd256dh` text NOT NULL,
	`auth` text NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
