"use client";

import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";

export function IOSInstallPrompt() {
	const [isIOS, setIsIOS] = useState(false);
	const [isStandalone, setIsStandalone] = useState(false);

	useEffect(() => {
		setIsIOS(
			/iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window),
		);

		setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
	}, []);

	if (isStandalone || !isIOS) {
		return null; // Don't show install button if already installed or not iOS
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="h-9 p-0 px-1.5 [&_svg]:size-5 hover:translate-x-[4px]! hover:translate-y-[4px]! hover:shadow-none bg-secondary-background text-foreground">
					Instalar App
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-sm">
				<DialogHeader>
					<DialogTitle>Instala la App</DialogTitle>
				</DialogHeader>
				<p>
					Para instalar la App en tu dispositivo iOS, toca el botón de compartir
					<span role="img" aria-label="share icon">
						{" "}
						⎋{" "}
					</span>
					y luego toca "Agregar a la pantalla de inicio"
					<span role="img" aria-label="plus icon">
						{" "}
						➕{" "}
					</span>
					.
				</p>
			</DialogContent>
		</Dialog>
	);
}
