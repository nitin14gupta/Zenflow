import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="age" options={{ headerShown: false, animation: Platform.select({ ios: "slide_from_right", android: "slide_from_right" }) }} />
      <Stack.Screen name="gender" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="sleep" options={{ headerShown: false }} />
      <Stack.Screen name="morning" options={{ headerShown: false }} />
      <Stack.Screen name="energy" options={{ headerShown: false }} />
      <Stack.Screen name="lifestyle" options={{ headerShown: false }} />
      <Stack.Screen name="goals" options={{ headerShown: false }} />
      <Stack.Screen name="motivation" options={{ headerShown: false }} />
      <Stack.Screen name="distractions" options={{ headerShown: false }} />
      <Stack.Screen name="procrastination" options={{ headerShown: false }} />
      <Stack.Screen name="statistics" options={{ headerShown: false }} />
      <Stack.Screen name="desires" options={{ headerShown: false }} />
      <Stack.Screen name="statement1" options={{ headerShown: false }} />
      <Stack.Screen name="statement2" options={{ headerShown: false }} />
      <Stack.Screen name="statement3" options={{ headerShown: false }} />
      <Stack.Screen name="statement4" options={{ headerShown: false }} />
      <Stack.Screen name="ready" options={{ headerShown: false }} />
      <Stack.Screen name="final" options={{ headerShown: false }} />
    </Stack>
  )
}
