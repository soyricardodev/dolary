import type { SVGProps } from "react";

export function DollarIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="1em"
			height="1em"
			viewBox="0 0 24 24"
			{...props}
		>
			<title>Dolar</title>
			<path
				fill="currentColor"
				d="M11 2h2v4h6v2H7v3H5V6h6zM5 18h6v4h2v-4h6v-2H5zm14-7H5v2h12v3h2z"
			/>
		</svg>
	);
}
