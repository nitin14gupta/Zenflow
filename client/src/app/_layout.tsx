import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { useEffect } from "react";
import { View } from "react-native";
import { OnboardingProvider } from "../context/OnboardingContext";
import { ToastProvider } from "../context/ToastContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    // Could add splash screen hide logic here if using expo-splash-screen
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View />;
  }
  return (
    <OnboardingProvider>
      <ToastProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </ToastProvider>
    </OnboardingProvider>
  )
}
