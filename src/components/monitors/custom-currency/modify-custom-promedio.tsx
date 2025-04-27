"use client";

import { useState } from "react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { CustomPromedioForm } from "./custom-promedio-form";
import { SettingsIcon } from "lucide-react";
import { useCurrencyContext } from "@/context/currency-context";

export function ModifyCustomPromedio() {
	const { custom } = useCurrencyContext();

	const [open, setOpen] = useState(false);

	const handleSuccess = () => {
		setOpen(false);
	};

	return (
		<>
			<Button
				onClick={(e) => {
					e.stopPropagation();
					setOpen(true);
				}}
				size="icon"
				className="size-8 p-0 [&_svg]:size-4 hover:translate-x-[4px]! hover:translate-y-[4px]! hover:shadow-none mr-1"
				aria-label="Configurar tasa personalizada"
				title="Configurar tasa"
			>
				<SettingsIcon className="size-4" />
			</Button>
			<ResponsiveDialog open={open} onOpenChange={setOpen}>
				<DialogTitle className="my-4 text-center">
					Edita tu tasa personalizada
				</DialogTitle>

				<CustomPromedioForm initialValue={custom} onSuccess={handleSuccess} />
			</ResponsiveDialog>
		</>
	);
}
