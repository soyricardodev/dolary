import { Link, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function Modal() {
	const [message, setMessage] = useState("");
	const [canSubmit, setCanSubmit] = useState(false);

	async function submitFeedback() {
		if (canSubmit) {
			fetch("/api/feedback", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ message }),
			});
			setMessage("");
			setCanSubmit(false);
			router.back();
		}
	}

	useEffect(() => {
		if (message.length > 10 && message.trim() !== "") {
			setCanSubmit(true);
		} else {
			setCanSubmit(false);
		}
	}, [message]);

	const isPresented = router.canGoBack();

	return (
		<View style={styles.container}>
			{!isPresented && <Link href="../">Dismiss</Link>}
			<StatusBar style="light" />

			<View style={styles.formContainer}>
				<Text style={styles.formTitle}>Sugerencias</Text>

				<TextInput
					placeholder="Escribe tu sugerencia la cual debe tener mas de 10 caracteres"
					value={message}
					onChangeText={setMessage}
					style={styles.formInput}
				/>

				<Pressable
					onPress={() => {
						if (canSubmit) {
							submitFeedback();
						}
					}}
					disabled={!canSubmit}
				>
					<Text style={{ opacity: canSubmit ? 1 : 0.7, ...styles.sendButton }}>
						Enviar
					</Text>
				</Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: 20,
	},
	formContainer: {
		display: "flex",
		gap: 12,
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
	},
	formTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 20,
	},
	formInput: {
		width: "100%",
		height: 100,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#ccc",
	},
	sendButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		fontSize: 18,
		color: "#fff",
		borderRadius: 20,
		width: "100%",
		backgroundColor: "#000",
	},
});
