import { Providers } from "../components/providers";
import type { Metadata } from "next";
import "./index.css";

export const metadata: Metadata = {
	title: "Calculadora Dolar Venezuela | Dolary",
	description: "Calculadora Dolar Venezuela | Dolary",
};

export default function RootLayout({
	children,
}: { children: React.ReactNode }) {
	return (
		<html lang="es">
			<head>
				<link rel="icon" type="image/svg+xml" href="/vite.svg" />
			</head>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
