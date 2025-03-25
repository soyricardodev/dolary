"use client";

import { useState } from "react";
import { ResponsiveDialog } from "./responsive-dialog";
import { Button } from "./ui/button";
import { DialogTitle } from "./ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import useLocalStorage from "@/hooks/use-local-storage";
import { type CustomPromedio, CustomPromedioKey } from "@/types";

const addCustomPromedioSchema = z.object({
	name: z.string().min(1, { message: "Debe tener al menos una letra" }),
	price: z.coerce.number().positive({ message: "Debe ser un número positivo" }),
});
type AddCustomPromedioInput = z.infer<typeof addCustomPromedioSchema>;

export function AddCustomPromedio() {
	const form = useForm({
		resolver: zodResolver(addCustomPromedioSchema),
		defaultValues: {
			name: "Personalizado",
			price: 85,
		},
	});

	const [_, setCustomCurrency] =
		useLocalStorage<CustomPromedio>(CustomPromedioKey);

	const [open, setOpen] = useState(false);

	function onSubmit(data: AddCustomPromedioInput) {
		setCustomCurrency(data);
		window.location.reload();
	}

	return (
		<>
			<Button
				onClick={() => setOpen(!open)}
				variant="neutral"
				className="lg:col-span-3"
			>
				Agregar tasa personalizada
			</Button>
			<ResponsiveDialog open={open} onOpenChange={setOpen}>
				<DialogTitle className="my-4 text-center">
					Agrega tu tasa personalizada
				</DialogTitle>

				<Form {...form}>
					<form
						className="flex flex-col gap-2"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nombre</FormLabel>
									<FormControl>
										<Input
											autoFocus
											placeholder="Nombre de la tasa"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="price"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Precio</FormLabel>
									<FormControl>
										<Input
											type="number"
											placeholder="Precio de la tasa"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit">Guardar</Button>
					</form>
				</Form>
			</ResponsiveDialog>
		</>
	);
}
