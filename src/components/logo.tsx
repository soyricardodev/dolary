import Link from "next/link";

export function Logo() {
	return (
		<Link
			href="/"
			className="text-[30px] h-11 w-11 rounded-base flex bg-main text-black border-2 border-black items-center justify-center font-heading"
			aria-label="Dolary: Calculadora de tasas del Dólar para Venezuela"
		>
			D
		</Link>
	);
}
