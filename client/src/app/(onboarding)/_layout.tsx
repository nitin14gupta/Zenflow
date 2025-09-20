import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: Platform.select({
          ios: "slide_from_right",
          android: "slide_from_right"
        }),
        animationDuration: 300,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="age" options={{
        animation: Platform.select({
          ios: "slide_from_right",
          android: "slide_from_right"
        })
      }} />
      <Stack.Screen name="gender" options={{
        animation: Platform.select({
          ios: "slide_from_right",
          android: "slide_from_right"
        })
      }} />
      <Stack.Screen name="welcome" options={{
        animation: Platform.select({
          ios: "slide_from_right",
          android: "slide_from_right"
        })
      }} />
      <Stack.Screen name="sleep" options={{
        animation: Platform.select({
          ios: "slide_from_right",
          android: "slide_from_right"
        })
      }} />
      <Stack.Screen name="morning" options={{
        animation: Platform.select({
          ios: "slide_from_right",
          android: "slide_from_right"
        })
      }} />
      <Stack.Screen name="energy" options={{
        animation: Platform.select({
          ios: "slide_from_right",
          android: "slide_from_right"
        })
      }} />
      <Stack.Screen name="lifestyle" options={{
        animation: Platform.select({
          ios: "slide_from_right",
          android: "slide_from_right"
        })
      }} />
      <Stack.Screen name="goals" options={{
        animation: Platform.select({
          ios: "slide_from_right",
          android: "slide_from_right"
        })
      }} />
      <Stack.Screen name="motivation" options={{
        animation: Platform.select({
          ios: "slide_from_right",
          android: "slide_from_right"
        })
      }} />
      <Stack.Screen name="distractions" options={{
        animation: Platform.select({
          ios: "slide_from_right",
          android: "slide_from_right"
        })
      }} />
      <Stack.Screen name="procrastination" options={{
        animation: Platform.select({
          ios: "slide_from_right",
          android: "slide_from_right"
        })
      }} />
      <Stack.Screen name="statistics" options={{
        animation: Platform.select({
          ios: "slide_from_right",
          android: "slide_from_right"
        })
      }} />
      <Stack.Screen name="desires" options={{
        animation: Platform.select({
          ios: "slide_from_right",
          android: "slide_from_right"
        })
      }} />
      <Stack.Screen name="statement1" options={{
        animation: Platform.select({
          ios: "slide_from_right",
          android: "slide_from_right"
        })
      }} />
      <Stack.Screen name="statement2" options={{
        animation: Platform.select({
          ios: "slide_from_right",
          android: "slide_from_right"
        })
      }} />
      <Stack.Screen name="statement3" options={{
        animation: Platform.select({
          ios: "slide_from_right",
          android: "slide_from_right"
        })
      }} />
      <Stack.Screen name="statement4" options={{
        animation: Platform.select({
          ios: "slide_from_right",
          android: "slide_from_right"
        })
      }} />
      <Stack.Screen name="ready" options={{
        animation: Platform.select({
          ios: "slide_from_right",
          android: "slide_from_right"
        })
      }} />
      <Stack.Screen name="final" options={{
        animation: Platform.select({
          ios: "fade",
          android: "fade"
        })
      }} />
    </Stack>
  )
}
