import { Providers } from "../components/providers";
import type { Metadata, Viewport } from "next";
import "./index.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const APP_NAME = "Dolary";
const APP_DEFAULT_TITLE = "Calculadora Dolar Venezuela";
const APP_TITLE_TEMPLATE = "%s - Dolary";
const APP_DESCRIPTION =
	"La mejor calculadora sin anuncios, gratis, rápida y sin acceso a internet para Venezuela!";

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
				<Analytics />
				<SpeedInsights />
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
