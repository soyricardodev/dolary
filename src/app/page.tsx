import { AppFooter } from "@/components/app-footer";
import { AppHeader } from "@/components/app-header";
import { Dolary } from "@/components/dolary";

export default function RootPage() {
	return (
		<main className="min-h-screen p-3 flex flex-col font-sans mx-auto">
			<AppHeader />

			<div className="flex-grow flex flex-col justify-center">
				<Dolary />
			</div>

			<AppFooter />
		</main>
	);
}
