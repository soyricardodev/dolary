import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, type ChangeEvent } from "react";

interface CalculatorProps {
	rates: {
		bcv: number;
		paralelo: number;
		promedio: number;
		custom?: number;
	};
	selectedCurrency: string;
}

export function Calculator({ rates, selectedCurrency }: CalculatorProps) {
	const [amount, setAmount] = useState<string>("");
	const [result, setResult] = useState<string>("");

	const handleCalculate = () => {
		const numAmount = Number.parseFloat(amount);
		if (Number.isNaN(numAmount)) {
			setResult("Por favor ingrese un número válido");
			return;
		}

		const rate = rates[selectedCurrency as keyof typeof rates];
		if (!rate) {
			setResult("Tasa no disponible");
			return;
		}

		const calculated = numAmount * rate;
		setResult(
			new Intl.NumberFormat("es-VE", {
				style: "currency",
				currency: "VES",
			}).format(calculated),
		);
	};

	const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
		setAmount(e.target.value);
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-col gap-2">
				<label htmlFor="amount" className="text-sm font-medium">
					Monto en Bs.
				</label>
				<Input
					id="amount"
					type="number"
					placeholder="Ingrese el monto"
					value={amount}
					onChange={handleAmountChange}
				/>
			</div>

			<div className="flex flex-col gap-2">
				<label htmlFor="result" className="text-sm font-medium">
					Resultado
				</label>
				<div className="flex items-center gap-2">
					<Input
						id="result"
						readOnly
						value={result}
						placeholder="El resultado aparecerá aquí"
					/>
					<Button onClick={handleCalculate}>Calcular</Button>
				</div>
			</div>
		</div>
	);
}
