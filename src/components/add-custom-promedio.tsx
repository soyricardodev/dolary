"use client";

import { useState } from "react";
import { ResponsiveDialog } from "./responsive-dialog";
import { Button } from "./ui/button";
import { DialogTitle } from "./ui/dialog";

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
