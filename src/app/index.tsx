import { useEffect } from "react";
import { Text, View } from "@/components/Themed";
import { CurrencyIcon } from "@/components/icons";
import { type AllCurrencies, allCurrenciesQuery } from "@/query/all";
import { setStringAsync } from "expo-clipboard";
import { Link } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { mockData } from "@/server/queries";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function App() {
	const queryClient = useQueryClient();
	const { data, isLoading } = useQuery({
		queryKey: ["all"],
		queryFn: async () =>
			await fetch("/api/all").then(
				(res) => res.json() as Promise<AllCurrencies>,
			),
		placeholderData: () => mockData,
		initialData: queryClient.getQueryData(["all"]),
	});

	async function copyValueToClipboard(value: string) {
		await setStringAsync(value);
	}

	useEffect(() => {
		console.log("data", data);
	}, [data]);

	return (
		<View style={styles.container}>
			<Link href="/feedback-modal" style={styles.feedbackButton}>
				Sugerencias
			</Link>
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Dolary</Text>
			</View>
			<Text style={styles.headerStatus}>
				{isLoading && "Cargando..."}
				{!isLoading && (
					<>
						Datos Actualizados {new Date().getDay()}/{new Date().getMonth()}/
						{new Date().getFullYear()}
					</>
				)}
			</Text>
			<View style={styles.currencies}>
				{data?.data.map((currency, index) => {
					const currencyValueFormatted = currency.value.toFixed(2);

					return (
						<Pressable
							onPress={() => copyValueToClipboard(currencyValueFormatted)}
							key={`${currency.label}-${currency.name}-${index}`}
						>
							<View style={styles.currencyContainer}>
								<View style={styles.currencyNameContainer}>
									<View
										style={{
											borderColor: currency.color,
											...styles.currencyLogo,
										}}
									>
										<CurrencyIcon name={currency.currency} />
									</View>
									<View>
										<Text style={styles.currencyLabel}>{currency.label}</Text>
										<Text style={styles.currencyName}>{currency.name}</Text>
									</View>
								</View>
								<View style={styles.currencyValueContainer}>
									<Text style={styles.currencyValue}>
										{currencyValueFormatted}
										<Text style={styles.currencyValueName}>Bs</Text>
									</Text>
								</View>
							</View>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		fontFamily: "OpenSans",
	},
	feedbackButton: {
		position: "absolute",
		right: 8,
		top: 4,
		paddingVertical: 5,
		paddingHorizontal: 10,
		color: "#000",
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 9999,
		fontFamily: "OpenSans",
	},
	header: {},
	headerTitle: {
		fontSize: 44,
		textAlign: "center",
		fontWeight: "600",
		fontFamily: "OpenSansBold",
	},
	headerStatus: {
		fontSize: 14,
		textAlign: "center",
		paddingTop: 2,
		paddingBottom: 2,
		paddingLeft: 8,
		paddingRight: 8,
		borderRadius: 9999,
		backgroundColor: "#eee",
		fontFamily: "OpenSans",
	},
	currencies: {
		width: "100%",
		padding: 16,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		gap: 16,
	},
	currencyContainer: {
		width: "100%",
		padding: 16,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 16,
		borderRadius: 22,
		borderWidth: 2,
		borderColor: "#111",
		backgroundColor: "#f6f6f6",
	},
	currencyNameContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		backgroundColor: "#f7f7f7",
	},
	currencyLogo: {
		width: 32,
		height: 32,
		borderRadius: 16,
		backgroundColor: "#111",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 2,
	},
	currencyLabel: {
		fontWeight: "600",
		fontSize: 16,
		backgroundColor: "#f7f7f7",
		fontFamily: "OpenSansBold",
	},
	currencyName: {
		fontSize: 16,
		fontWeight: "300",
		backgroundColor: "#f7f7f7",
		fontFamily: "OpenSans",
	},
	currencyValueContainer: {
		display: "flex",
		flexDirection: "row",
		gap: 4,
		backgroundColor: "#f7f7f7",
	},
	currencyValue: {
		fontSize: 20,
		fontWeight: "600",
		fontFamily: "OpenSansBold",
	},
	currencyValueName: {
		fontSize: 15,
		fontWeight: "300",
		marginLeft: 2,
		paddingLeft: 2,
	},
});
