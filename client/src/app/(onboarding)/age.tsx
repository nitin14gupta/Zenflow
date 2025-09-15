import React, { useState } from "react";
import { Text, View } from "react-native";
import { Button, CardOption, ProgressBar, ScreenContainer, Title } from "../../components/ui";
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
        </ScreenContainer>
    );
}


