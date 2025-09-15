import React from "react";
import { View } from "react-native";
import { ScreenContainer, Title, Button } from "../../components/ui";
import { useRouter } from "expo-router";

export default function Login() {
    const router = useRouter();
    return (
        <ScreenContainer>
            <Title>Welcome back</Title>
            <View style={{ flex: 1 }} />
            <Button onPress={() => router.replace("/")}>Back to Home</Button>
        </ScreenContainer>
    );
}


