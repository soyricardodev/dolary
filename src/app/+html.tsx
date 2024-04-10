import { ScrollViewStyleReset } from "expo-router/html";

export default function Root({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, shrink-to-fit=no"
				/>
				<title>Dolary - Tasa del dolar en Venezuela en tiempo real</title>
				<ScrollViewStyleReset />
			</head>
			<body className="font-sans antialiased min-h-dvh">{children}</body>
		</html>
	);
}
