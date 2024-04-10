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
				<ScrollViewStyleReset />
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
				<style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
				{/* Add any additional <head> elements that you want globally available on web... */}
			</head>
			<body>{children}</body>
		</html>
	);
}

const responsiveBackground = `
body {
  background-color: #fff;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
  }
}`;
