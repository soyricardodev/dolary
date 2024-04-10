import FontAwesome from "@expo/vector-icons/FontAwesome";
// import {
// 	DarkTheme,
// 	DefaultTheme,
// 	ThemeProvider,
// } from "@react-navigation/native";
import {
	Query,
	QueryClient,
	QueryClientProvider,
	focusManager,
} from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { type AppStateStatus, Platform } from "react-native";

import { useAppState } from "@/hooks/use-app-state";
import { useOnlineManager } from "@/hooks/use-online-manager";

// import { useColorScheme } from "@/components/useColorScheme";

import "./globals.css";

function onAppStateChange(status: AppStateStatus) {
	if (Platform.OS !== "web") {
		focusManager.setFocused(status === "active");
	}
}

const queryClient = new QueryClient({
	defaultOptions: { queries: { retry: 2 } },
});

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	useOnlineManager();
	useAppState(onAppStateChange);
	const [loaded, error] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
		...FontAwesome.font,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
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
			<Slot />
		</QueryClientProvider>
	);
}

// function RootLayoutNav() {
// 	const colorScheme = useColorScheme();

// 	return (
// 		<ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
// 			<Stack>
// 				<Stack.Screen
// 					name="index"
// 					options={{ headerShown: false, title: "Home" }}
// 				/>
// 			</Stack>
// 		</ThemeProvider>
// 	);
// }
