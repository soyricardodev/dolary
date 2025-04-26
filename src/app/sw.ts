import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import {
	Serwist,
	NetworkFirst,
	CacheFirst,
	ExpirationPlugin,
	NetworkOnly,
} from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
	interface WorkerGlobalScope extends SerwistGlobalConfig {
		__SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
	}
}

// Use a specific version for the purge phase
const SW_VERSION = "1.3-purge";
console.log("SW_VERSION", SW_VERSION);

declare const self: ServiceWorkerGlobalScope;

// Filter out any entries that might cause 404 errors
const filterPrecacheEntries = (
	entries: (PrecacheEntry | string)[] | undefined,
) => {
	if (!entries) return [];

	// In development, we'll be more selective about what we precache
	if (process.env.NODE_ENV === "development") {
		// Only precache essential files in development
		return entries.filter((entry) => {
			// If it's a string, check if it's a static asset
			if (typeof entry === "string") {
				// Only precache static assets like images, icons, etc.
				return /\.(png|jpg|jpeg|svg|gif|ico|webp)$/.test(entry);
			}

			// If it's a PrecacheEntry, check its URL
			if (entry && typeof entry === "object" && "url" in entry) {
				return /\.(png|jpg|jpeg|svg|gif|ico|webp)$/.test(entry.url as string);
			}

			return false;
		});
	}

	// In production, we can be more aggressive with precaching
	return entries;
};

const serwist = new Serwist({
	precacheEntries: filterPrecacheEntries(self.__SW_MANIFEST),
	skipWaiting: true,
	clientsClaim: true,
	navigationPreload: true,
	runtimeCaching: [
		{
			// API routes should use NetworkFirst with short cache times
			matcher: ({ url }) => {
				// Match API routes
				return url.pathname.startsWith("/api/");
			},
			// Use NetworkOnly during the purge phase
			handler: new NetworkOnly({
				plugins: [
					new ExpirationPlugin({
						maxEntries: 50,
						maxAgeSeconds: 60, // 1 minute cache for API data
					}),
				],
				networkTimeoutSeconds: 5, // Consider adjusting timeout if needed
			}),
		},
		{
			// Keep caching strategy for your app's domain
			matcher: ({ url }) => url.origin === "https://dolary.vercel.app",
			handler: new NetworkFirst({
				// Keep NetworkFirst for pages
				cacheName: `pages-cache-v${SW_VERSION}`,
				plugins: [
					new ExpirationPlugin({
						maxEntries: 50,
						maxAgeSeconds: 24 * 60 * 60, // 24 hours - Adjust if needed
					}),
				],
				networkTimeoutSeconds: 10,
			}),
		},
		{
			// Keep CacheFirst for static assets
			matcher: ({ request }) => {
				const url = new URL(request.url);
				return /\.(?:css|png|jpg|jpeg|svg|gif|ico)$/.test(url.pathname);
			},
			handler: new CacheFirst({
				// Keep CacheFirst for statics
				cacheName: `static-resources-v${SW_VERSION}`,
				plugins: [
					new ExpirationPlugin({
						maxEntries: 100,
						maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
					}),
				],
			}),
		},
		// Include defaultCache if you still want its behaviors for other requests
		// ...defaultCache,
	],
});

// Add a listener for the 'message' event to handle cache clearing requests
self.addEventListener("message", (event) => {
	if (event.data && event.data.type === "CLEAR_CACHE") {
		// Clear specific caches based on the request
		if (event.data.cacheName) {
			caches.delete(event.data.cacheName).then((success) => {
				console.log(
					`Cache ${event.data.cacheName} ${success ? "cleared" : "not found"}`,
				);
			});
		} else {
			// Clear all caches
			caches
				.keys()
				.then((cacheNames) => {
					return Promise.all(
						cacheNames.map((cacheName) => {
							return caches.delete(cacheName);
						}),
					);
				})
				.then(() => {
					console.log("All caches cleared");
				});
		}
	}
});

self.addEventListener("push", (event) => {
	if (event.data) {
		const data = event.data.json();
		const options = {
			body: data.body,
			icon: data.icon || "/icon-192x192.png", // Larger default icon
			badge: "/badge.png", // Use app icon as badge
			vibrate: [200, 100, 200], // Stronger vibration pattern
			tag: data.tag || "default", // Group similar notifications
			renotify: true, // Vibrate on new notifications even if tag matches
			actions: [
				{
					action: "open",
					title: "Abrir",
				},
				{
					action: "close",
					title: "Cerrar",
				},
			],
			data: {
				timestamp: Date.now(),
				url: data.url || "https://dolary.vercel.app",
			},
		};

		event.waitUntil(
			self.registration.showNotification(data.title, {
				...options,
				silent: data.silent || false, // Allow control over sound
			}),
		);
	}
});

self.addEventListener("notificationclick", (event) => {
	console.log("Notification click received");
	event.notification.close();
	event.waitUntil(self.clients.openWindow("https://dolary.vercel.app"));
});

self.addEventListener("install", () => {
	console.log(`[SW ${SW_VERSION}] Install`);
	// Skip waiting to activate the new service worker immediately
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	console.log(`[SW ${SW_VERSION}] Activate`);
	// Clear old caches that don't match the current version
	event.waitUntil(
		caches
			.keys()
			.then((cacheNames) => {
				return Promise.all(
					cacheNames
						.filter((cacheName) => !cacheName.endsWith(`-v${SW_VERSION}`))
						.map((cacheName) => caches.delete(cacheName)),
				);
			})
			.then(() => self.clients.claim()), // Claim clients AFTER clearing old caches
	);
});

serwist.addEventListeners();
