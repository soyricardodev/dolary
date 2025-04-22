import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, CacheFirst, NetworkFirst, ExpirationPlugin } from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
	interface WorkerGlobalScope extends SerwistGlobalConfig {
		__SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
	}
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
	precacheEntries: self.__SW_MANIFEST,
	skipWaiting: true,
	clientsClaim: true,
	navigationPreload: true,
	runtimeCaching: [
		{
			matcher: ({ url }) => url.origin === "https://dolary.vercel.app",
			handler: new NetworkFirst({
				cacheName: "pages-cache",
				plugins: [
					new ExpirationPlugin({
						maxEntries: 50,
						maxAgeSeconds: 24 * 60 * 60, // 24 hours
					}),
				],
				networkTimeoutSeconds: 10,
			}),
		},
		{
			matcher: ({ request }) => {
				const url = new URL(request.url);
				return /\.(?:js|css|png|jpg|jpeg|svg|gif|ico)$/.test(url.pathname);
			},
			handler: new CacheFirst({
				cacheName: "static-resources",
				plugins: [
					new ExpirationPlugin({
						maxEntries: 100,
						maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
					}),
				],
			}),
		},
		...defaultCache,
	],
});

self.addEventListener("push", (event) => {
	if (event.data) {
		const data = event.data.json();
		const options = {
			body: data.body,
			icon: data.icon || "/icon-72x72.png",
			badge: "/icon-48x48.png",
			vibrate: [100, 50, 100],
			data: {
				dateOfArrival: Date.now(),
				primaryKey: "2",
			},
		};
		event.waitUntil(self.registration.showNotification(data.title, options));
	}
});

self.addEventListener("notificationclick", (event) => {
	console.log("Notification click received");
	event.notification.close();
	event.waitUntil(self.clients.openWindow("https://dolary.vercel.app"));
});

serwist.addEventListeners();
