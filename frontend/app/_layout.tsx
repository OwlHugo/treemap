// app/_layout.tsx
import { getUserToken, removeUserToken } from "@/utils/auth";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { UserProvider } from "../contexts/UserContext";
import { validateAuthToken } from "@/services/authService";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      const timer = setTimeout(async () => {
        const isValidToken = await validateAuthToken();

        if (isValidToken) {
          router.replace("/home");
        } else {
          await removeUserToken();
          router.replace("/Login");
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <UserProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
              presentation: "containedModal",
            }}
          />
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="Login" options={{ headerShown: false }} />
          <Stack.Screen name="Register" options={{ headerShown: false }} />
        </Stack>
      </SafeAreaView>
    </UserProvider>
  );
}
