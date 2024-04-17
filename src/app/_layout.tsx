import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
	QueryClient,
	QueryClientProvider,
	focusManager,
} from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { type AppStateStatus, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppState } from "@/hooks/use-app-state";
import { useOnlineManager } from "@/hooks/use-online-manager";

import "./globals.css";

function onAppStateChange(status: AppStateStatus) {
	if (Platform.OS !== "web") {
		focusManager.setFocused(status === "active");
	}
}

const queryClient = new QueryClient({
	defaultOptions: { queries: { retry: 2 } },
});

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
	initialRouteName: "index",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	useOnlineManager();
	useAppState(onAppStateChange);
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		SpaceMonoBold: require("../assets/fonts/SpaceMono-Bold.ttf"),
		...FontAwesome.font,
	});

	useEffect(() => {
		if (error) throw error;
	}, [error]);

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<SafeAreaView style={{ flex: 1 }}>
				<Stack>
					<Stack.Screen
						name="index"
						options={{
							headerShown: false,
						}}
					/>
					<Stack.Screen
						name="feedback-modal"
						options={{
							presentation: "modal",
							headerTitle: "Dejar Sugerencias",
						}}
					/>
				</Stack>
			</SafeAreaView>
		</QueryClientProvider>
	);
}
