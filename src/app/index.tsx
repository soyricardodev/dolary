import { StyleSheet, Pressable } from "react-native";
import { setStringAsync } from "expo-clipboard";
import { Text, View } from "@/components/Themed";
import { allCurrenciesQuery } from "@/query/all";
import { CurrencyIcon } from "@/components/icons";
import { Link } from "expo-router";

export default function App() {
	const { data, isLoading } = allCurrenciesQuery();

	async function copyValueToClipboard(value: string) {
		await setStringAsync(value);
	}

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
							<View
								style={styles.currencyContainer}
							>
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
	},
	header: {},
	headerTitle: {
		fontSize: 44,
		textAlign: "center",
		fontWeight: "600",
		fontFamily: "monospace",
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
	},
	currencyName: {
		fontSize: 16,
		fontWeight: "300",
		backgroundColor: "#f7f7f7",
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
	},
	currencyValueName: {
		fontSize: 15,
		fontWeight: "400",
		marginLeft: 2,
		paddingLeft: 2,
	},
});
