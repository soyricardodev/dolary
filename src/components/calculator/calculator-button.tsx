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
			"h-14 w-full text-lg font-bold transition-transform active:scale-95 border-2 border-border";

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
