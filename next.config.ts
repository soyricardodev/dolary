import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
	swSrc: "./src/app/sw.ts",
	swDest: "./public/sw.js",
	disable: process.env.NODE_ENV !== "production",
});

export default withSerwist({
	eslint: { ignoreDuringBuilds: true },
	typescript: { ignoreBuildErrors: true },
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "X-Frame-Options",
						value: "DENY",
					},
					{
						key: "Referrer-Policy",
						value: "strict-origin-when-cross-origin",
					},
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/sw.js",
				headers: [
					{
						key: "Content-Type",
						value: "application/javascript; charset=utf-8",
					},
					{
						key: "Cache-Control",
						value: "no-cache, no-store, must-revalidate",
					},
				],
			},
		];
	},
	compiler: {
		removeConsole:
			process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
	},
	experimental: {},
});
