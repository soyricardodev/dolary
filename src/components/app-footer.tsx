import { GithubIcon } from "./icons/github-icon";

export function AppFooter() {
	return (
		<footer className="text-center text-xs text-foreground">
			<div className="flex items-center justify-center gap-1">
				<p className="flex gap-1">
					Creado por{" "}
					<a
						href="https://github.com/soyricardodev/dolary"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="GitHub de Ricardo Castro"
						className="flex items-center gap-1 hover:underline font-semibold"
					>
						Ricardo Castro
						<GithubIcon className="size-4 fill-foreground" />
					</a>
				</p>
			</div>
		</footer>
	);
}
