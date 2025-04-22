import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Calculadora del Dolar en Venezuela | Dolary",
		short_name: "Dolary",
		description:
			"Una calculadora sin anuncios, rapida y sin conexion a internet para calcular el precio del dolar en Venezuela",
		start_url: "/",
		display: "standalone",
		background_color: "#ffffff",
		theme_color: "#000000",
		icons: [
			{
				src: "/icon-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/icon-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
