"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { DeleteIcon, PercentIcon } from "lucide-react";

type ButtonVariant = "number" | "function" | "delete" | "equals";
type IconType = "delete" | "percent" | null;

interface CalculatorButtonProps {
	onClickAction: () => void;
	children?: ReactNode;
	variant: ButtonVariant;
	icon?: IconType;
}

export function CalculatorButton({
	onClickAction,
	children,
	variant,
	icon,
}: CalculatorButtonProps) {
	// Define styles based on variant
	const getButtonStyles = (): string => {
		const baseStyles =
			"h-14 w-full text-lg font-bold border-black border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-transform active:scale-95";

		switch (variant) {
			case "number":
				return baseStyles;
			case "function":
				return `${baseStyles} bg-gray-500 hover:bg-gray-300 text-white`;
			case "delete":
				return `${baseStyles} bg-orange-300 hover:bg-orange-200 flex items-center justify-center`;
			case "equals":
				return `${baseStyles} bg-yellow-400 hover:bg-yellow-300 text-black hover:scale-105`;
			default:
				return baseStyles;
		}
	};

	// Render icon if specified
	const renderContent = () => {
		if (icon === "delete") return <DeleteIcon size={20} />;
		if (icon === "percent") return <PercentIcon size={20} />;
		return children;
	};

	return (
		<Button onClick={onClickAction} className={getButtonStyles()}>
			{renderContent()}
		</Button>
	);
}
