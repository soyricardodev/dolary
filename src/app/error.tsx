"use client";

import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-3">
			<div className="text-center max-w-md">
				<h2 className="text-2xl font-bold mb-4">¡Algo salió mal!</h2>
				<p className="mb-6 text-foreground/80">
					Ha ocurrido un error al cargar la aplicación. Por favor, inténtalo de
					nuevo.
				</p>
				<Button
					onClick={() => reset()}
					className="bg-main text-main-foreground px-6 py-2 rounded-md shadow-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
				>
					Intentar de nuevo
				</Button>
			</div>
		</div>
	);
}
