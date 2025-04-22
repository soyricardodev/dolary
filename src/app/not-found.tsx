import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center p-3">
			<div className="text-center max-w-md">
				<h2 className="text-4xl font-bold mb-2">404</h2>
				<h3 className="text-2xl font-semibold mb-4">Página no encontrada</h3>
				<p className="mb-6 text-foreground/80">
					Lo sentimos, la página que estás buscando no existe o ha sido movida.
				</p>
				<Link href="/">
					<Button className="bg-main text-main-foreground px-6 py-2 rounded-md shadow-md hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
						Volver al inicio
					</Button>
				</Link>
			</div>
		</div>
	);
}
