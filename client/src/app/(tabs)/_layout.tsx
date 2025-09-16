import { Stack } from "expo-router";
// import { Text } from "react-native";
// import { colors } from "../../components/ui";

export default function TabsLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>

    )
}