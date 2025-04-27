"use client";

import { useState } from "react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";

import { CustomPromedioForm } from "./custom-promedio-form";

export function AddCustomPromedio() {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setOpen(!open)} variant="neutral">
				Agrega una tasa personalizada
			</Button>
			<ResponsiveDialog open={open} onOpenChange={setOpen}>
				<DialogTitle className="my-4 text-center">
					Agrega tu tasa personalizada
				</DialogTitle>

				<CustomPromedioForm />
			</ResponsiveDialog>
		</>
	);
}
