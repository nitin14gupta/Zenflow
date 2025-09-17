import React, { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { Button, CardOption, ProgressBar, ScreenContainer, Title, colors } from "../../components/ui";
import { useOnboarding } from "../../context/OnboardingContext";
import { useRouter } from "expo-router";

const OPTIONS = ["18-24", "25-34", "35-44", "45+"];

export default function Age() {
    const { setAnswer, answers } = useOnboarding();
    const [selected, setSelected] = useState<string | undefined>(answers.age);
    const router = useRouter();
    const onNext = () => {
        if (!selected) return;
        setAnswer("age", selected);
        router.push("/(onboarding)/gender");
    };

    return (
        <ScreenContainer>
            <ProgressBar progress={1 / 19} />
            <Title>What is your age?</Title>
            <View style={{ marginTop: 16 }}>
                {OPTIONS.map(o => (
                    <CardOption key={o} label={o} selected={selected === o} onPress={() => setSelected(o)} />
                ))}
            </View>
            <View style={{ flex: 1 }} />
            <Button onPress={onNext}>
                Continue
            </Button>
            <View style={{ alignItems: "center", marginTop: 12 }}>
                <Text style={{ color: "#6B7280", fontSize: 14, fontFamily: "Poppins_400Regular", marginBottom: 6 }}>or</Text>
                <Pressable onPress={() => router.replace("/(auth)/login")}>
                    <Text style={{ color: colors.purple, fontFamily: "Poppins_600SemiBold", fontSize: 16 }}>Log In</Text>
                </Pressable>
            </View>
        </ScreenContainer>
    );
}


