import React from "react";
import { Text, View } from "react-native";
import { ScreenContainer, Title, Button } from "../../components/ui";
import { useRouter } from "expo-router";

export default function Register() {
    const router = useRouter();
    return (
        <ScreenContainer>
            <Title>Create your account</Title>
            <View style={{ flex: 1 }} />
            <Button onPress={() => router.replace("/")}>Back to Home</Button>
        </ScreenContainer>
    );
}


