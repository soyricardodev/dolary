"use client";

import { Button } from "@/components/ui/button";
import { RefreshCwIcon } from "lucide-react";

export default function ErrorBoundary({
	reset,
	error,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	console.log(error);

	const handleHardReload = () => {
		reset();
		window.location.reload();
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-3">
			<div className="text-center max-w-md">
				<h2 className="text-2xl font-bold mb-4">¡Algo salió mal!</h2>
				<p className="mb-6 text-foreground/80">
					Ha ocurrido un error al cargar la aplicación. Por favor, recarga la
					página completamente.
				</p>
				<div className="flex flex-col gap-4">
					<Button onMouseDown={handleHardReload}>
						<RefreshCwIcon className="h-5 w-5" />
						Recargar página
					</Button>
					<Button onMouseDown={handleHardReload} variant="neutral">
						Intentar de nuevo
					</Button>
				</div>
			</div>
		</div>
	);
}
