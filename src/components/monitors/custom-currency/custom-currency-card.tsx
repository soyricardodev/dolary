"use client";

import type React from "react";
import { AddCustomPromedio } from "./add-custom-promedio";
import { ModifyCustomPromedio } from "./modify-custom-promedio";
import { useCurrencyContext } from "@/context/currency-context";
import { CurrencyCard } from "../currency-card";

export function CustomCurrencyCard() {
	const { custom } = useCurrencyContext();

	if (!custom) return <AddCustomPromedio />;

	const configAction = <ModifyCustomPromedio />;

	return (
		<CurrencyCard
			currencyKey="custom"
			title={custom.name || "Personal"}
			price={custom.price}
			subtitle={"Tasa personalizada"}
			headerActions={configAction}
		/>
	);
}
