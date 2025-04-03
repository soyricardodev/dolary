"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface ResultDisplayProps {
	label: string;
	value: string;
}

export function ResultDisplay({ label, value }: ResultDisplayProps) {
	const [copied, setCopied] = useState(false);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(value);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="bg-white p-3 rounded-md border-black border-2 text-right relative">
			<div className="text-sm font-bold text-black">{label}</div>
			<div className="font-mono text-lg">{value}</div>
			<button
				type="button"
				className="absolute left-2 bottom-2 text-gray-500 hover:text-black transition-transform active:scale-90"
				onClick={copyToClipboard}
				aria-label="Copy result"
			>
				{copied ? (
					<Check
						size={18}
						className="text-green-500 transition-all duration-200"
					/>
				) : (
					<Copy size={18} className="transition-all duration-200" />
				)}
			</button>
		</div>
	);
}
