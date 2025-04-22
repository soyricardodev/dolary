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
			"h-10 sm:h-12 w-full text-sm sm:text-base font-bold transition-transform active:scale-95 border-2 border-border";

		switch (variant) {
			case "number":
				return `${baseStyles} bg-secondary-background text-foreground`;
			case "function":
				return `${baseStyles} bg-main text-main-foreground`;
			case "delete":
				return `${baseStyles} bg-main text-main-foreground flex items-center justify-center`;
			case "equals":
				return `${baseStyles} bg-main text-main-foreground hover:scale-105`;
			default:
				return baseStyles;
		}
	};

	// Render icon if specified
	const renderContent = () => {
		// Reduce icon size slightly for smaller screens
		const iconSize =
			typeof window !== "undefined" && window.innerWidth < 640 ? 18 : 20;
		if (icon === "delete") return <DeleteIcon size={iconSize} />;
		if (icon === "percent") return <PercentIcon size={iconSize} />;
		return children;
	};

	return (
		<Button onClick={onClickAction} className={getButtonStyles()}>
			{renderContent()}
		</Button>
	);
}
