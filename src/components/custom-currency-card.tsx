"use client";

import type React from "react";
import { AddCustomPromedio } from "./add-custom-promedio";
import { ModifyCustomPromedio } from "./modify-custom-promedio";
import { useCurrencyContext } from "@/context/currency-context";
import { CurrencyCard } from "./currency-card";

export function CustomCurrencyCard({ key }: { key: string }) {
	const { custom } = useCurrencyContext();

	if (!custom) return <AddCustomPromedio />;

	const configAction = <ModifyCustomPromedio />;

	return (
		<CurrencyCard
			title={custom.name || "Personalizado"}
			price={custom.price}
			key={key}
			subtitle={"Tasa personalizada"}
			headerActions={configAction}
		/>
	);
}
