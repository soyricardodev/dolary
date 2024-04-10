import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import { allCurrenciesQuery } from "@/query/all";

export default function App() {
	const { data, isLoading } = allCurrenciesQuery();

	return (
		<View
			style={styles.container}
			className="items-center justify-center font-sans"
		>
			<Text className="text-4xl font-bold my-4" style={{ fontFamily: "GeistMono" }}>
				Dolary v0.1
			</Text>
			<Text className="mb-2 text-lg">{isLoading ? "Cargando..." : "Datos actualizados"}</Text> 
			<View className="flex gap-2 w-full">
				{data?.data.map((currency) => (
					<View
						key={currency.name}
						className="w-full p-4 rounded-3xl flex flex-row gap-4 items-center bg-gray-200 border-4 border-gray-400" 
					>
						<Text className="capitalize font-semibold text-xl font-sans" style={{ fontFamily: "Geist" }}>
							{currency.name}
						</Text>
						<Text
							className="text-3xl font-bold font-mono"
							style={{ fontFamily: "GeistMono", }}
						>
							{currency.value}
						</Text>
					</View>
				))}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
