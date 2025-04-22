"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
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
import { useCurrencyContext } from "@/context/currency-context";
import type { CustomCurrencyData } from "@/context/currency-context";

const addCustomPromedioSchema = z.object({
	name: z
		.string()
		.min(1, { message: "Debe tener al menos una letra" })
		.optional(),
	price: z.coerce.number().positive({ message: "Debe ser un número positivo" }),
});
type AddCustomPromedioInput = z.infer<typeof addCustomPromedioSchema>;

export function CustomPromedioForm({
	initialValue,
	onSuccess,
}: {
	initialValue?: CustomCurrencyData | null;
	onSuccess?: () => void;
}) {
	const { updateCustomCurrency } = useCurrencyContext();
	const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
	const [deleteCountdown, setDeleteCountdown] = useState(5);

	const form = useForm<AddCustomPromedioInput>({
		resolver: zodResolver(addCustomPromedioSchema),
		defaultValues: initialValue ?? {
			name: "",
			price: 0,
		},
	});

	useEffect(() => {
		if (!isConfirmingDelete) return;

		// Reset countdown when starting confirmation
		setDeleteCountdown(5);

		// Set up the countdown display
		const countdownInterval = setInterval(() => {
			setDeleteCountdown((prev) => Math.max(0, prev - 1));
		}, 1000);

		// Set up the auto-delete timeout
		const deleteTimeout = setTimeout(() => {
			updateCustomCurrency(null);
			setIsConfirmingDelete(false);
			onSuccess?.();
		}, 5000);

		// Clean up both timers
		return () => {
			clearInterval(countdownInterval);
			clearTimeout(deleteTimeout);
		};
	}, [isConfirmingDelete, updateCustomCurrency, onSuccess]);

	function onSubmit(data: AddCustomPromedioInput) {
		const dataToSave: CustomCurrencyData = {
			price: data.price,
			...(data.name && { name: data.name }),
		};
		updateCustomCurrency(dataToSave);
		setIsConfirmingDelete(false);
		onSuccess?.();
	}

	return (
		<Form {...form}>
			<form
				className="flex flex-col gap-4"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nombre (Opcional)</FormLabel>
							<FormControl>
								<Input autoFocus placeholder="Ej: Mi Tasa" {...field} />
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
									step="0.01"
									placeholder="Ej: 39.50"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex gap-2 justify-end mt-2">
					{initialValue && (
						<Button
							type="button"
							className={`px-3 h-9 ${
								isConfirmingDelete
									? "bg-red-700 hover:bg-red-800 text-white"
									: "bg-red-600 hover:bg-red-700 text-white"
							}`}
							onClick={() => {
								if (isConfirmingDelete) {
									// Cancel deletion if clicked during countdown
									setIsConfirmingDelete(false);
								} else {
									// Start deletion countdown
									setIsConfirmingDelete(true);
								}
							}}
						>
							{isConfirmingDelete
								? `Cancelar (${deleteCountdown})`
								: "Eliminar"}
						</Button>
					)}
					<Button type="submit" className="px-3 h-9">
						Guardar
					</Button>
				</div>
			</form>
		</Form>
	);
}
