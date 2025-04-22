"use client";

import { useState } from "react";
import { CopyIcon, CheckIcon } from "lucide-react";

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
		<div className="bg-secondary-background p-3 rounded-md border-border border-2 text-right relative">
			<div className="text-xs sm:text-sm font-bold text-foreground">
				{label}
			</div>
			<div className="font-mono text-base sm:text-lg text-foreground">
				{value}
			</div>
			<button
				type="button"
				className="absolute left-2 bottom-2 text-foreground/60 hover:text-foreground transition-transform active:scale-90"
				onClick={copyToClipboard}
				aria-label="Copy result"
			>
				{copied ? (
					<CheckIcon
						size={18}
						className="text-green-500 transition-all duration-200"
					/>
				) : (
					<CopyIcon size={18} className="transition-all duration-200" />
				)}
			</button>
		</div>
	);
}
