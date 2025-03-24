import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import { PWAConfig } from "./src/lib/pwa-config";
import vercel from "vite-plugin-vercel";
import { getEntriesFromFs } from "vite-plugin-vercel/utils";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vercel({
			entries: [
				...(await getEntriesFromFs("endpoints/api", {
					// Auto mapping examples:
					//   endpoints/api/page.ts -> /api/page
					//   endpoints/api/name/[name].ts -> /api/name/*
					destination: "api",
				})),
			],
		}),
		react(),
		tailwindcss(),
		VitePWA(PWAConfig),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
