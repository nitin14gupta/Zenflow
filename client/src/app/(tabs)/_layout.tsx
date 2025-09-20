import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function TabsLayout() {
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
            <Stack.Screen
                name="index"
                options={{
                    animation: Platform.select({
                        ios: "fade",
                        android: "fade"
                    })
                }}
            />
        </Stack>
    )
}