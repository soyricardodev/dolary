import { Providers } from "../components/providers";
import type { Metadata, Viewport } from "next";
import "./index.css";
import { lazy, Suspense } from "react";

const LazyAnalytics = lazy(() =>
	import("@vercel/analytics/next").then((mod) => ({ default: mod.Analytics })),
);
const LazySpeedInsights = lazy(() =>
	import("@vercel/speed-insights/next").then((mod) => ({
		default: mod.SpeedInsights,
	})),
);

const APP_NAME = "Dolary";
const APP_DEFAULT_TITLE =
	"Dolary: Calculadora de tasas del Dólar para Venezuela";
const APP_TITLE_TEMPLATE = "%s - Dolary";
const APP_DESCRIPTION =
	"La mejor calculadora gratis, sin anuncios y sin acceso a internet para Venezuela!";

export const metadata: Metadata = {
	applicationName: APP_NAME,
	title: {
		default: APP_DEFAULT_TITLE,
		template: APP_TITLE_TEMPLATE,
	},
	description: APP_DESCRIPTION,
	appleWebApp: {
		capable: true,
		statusBarStyle: "default",
		title: APP_DEFAULT_TITLE,
	},
	formatDetection: {
		telephone: false,
	},
	openGraph: {
		type: "website",
		siteName: APP_NAME,
		title: {
			default: APP_DEFAULT_TITLE,
			template: APP_TITLE_TEMPLATE,
		},
		description: APP_DESCRIPTION,
	},
	twitter: {
		card: "summary",
		title: {
			default: APP_DEFAULT_TITLE,
			template: APP_TITLE_TEMPLATE,
		},
		description: APP_DESCRIPTION,
	},
	authors: {
		name: "Ricardo Castro",
		url: "https://github.com/soyricardodev",
	},
};

export const viewport: Viewport = {
	themeColor: "#FFFFFF",
};

export default function RootLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<html lang="es">
			<body>
				<Suspense>
					<LazyAnalytics />
				</Suspense>
				<Suspense>
					<LazySpeedInsights />
				</Suspense>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
