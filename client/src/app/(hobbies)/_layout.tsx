import { Stack } from "expo-router";

export default function HobbiesLayout() {
    return (
        <Stack>
            <Stack.Screen name="create" options={{ headerShown: false }} />
            <Stack.Screen name="library" options={{ headerShown: false }} />
            <Stack.Screen name="details" options={{ headerShown: false }} />
        </Stack>
    );
}
