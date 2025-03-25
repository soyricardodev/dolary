"use client";

import { useState } from "react";
import { ResponsiveDialog } from "./responsive-dialog";
import { Button } from "./ui/button";
import { DialogTitle } from "./ui/dialog";

import useLocalStorage from "@/hooks/use-local-storage";
import { type CustomPromedio, CustomPromedioKey } from "@/types";
import { CustomPromedioForm } from "./custom-promedio-form";
import { PencilIcon } from "lucide-react";

export function ModifyCustomPromedio() {
	const [customPromedio] = useLocalStorage<CustomPromedio>(CustomPromedioKey);

	const [open, setOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setOpen(!open)} size="icon">
				<PencilIcon />
			</Button>
			<ResponsiveDialog open={open} onOpenChange={setOpen}>
				<DialogTitle className="my-4 text-center">
					Edita tu tasa personalizada
				</DialogTitle>

				<CustomPromedioForm initialValue={customPromedio} />
			</ResponsiveDialog>
		</>
	);
}
