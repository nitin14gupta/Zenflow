import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Button, ProgressBar, ScreenContainer, Title, Subtitle, colors } from "../../components/ui";
import ConfettiCannon from "react-native-confetti-cannon";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";

export default function Ready() {
    const router = useRouter();
    const [checked, setChecked] = useState(false);
    const confettiRef = useRef<ConfettiCannon | null>(null);
    useEffect(() => {
        if (checked) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setTimeout(() => confettiRef.current?.start?.(), 50);
        }
    }, [checked]);

    return (
        <ScreenContainer>
            <ProgressBar progress={18 / 19} />
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 44, marginBottom: 8 }}>🚀</Text>
                <Title>Are you ready to start?</Title>
                <Subtitle>Your personalized plan is set. Check the box below and let's launch!</Subtitle>
            </View>
            <View style={{ marginTop: 24, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Pressable onPress={() => setChecked(!checked)} style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: colors.purple, alignItems: 'center', justifyContent: 'center', backgroundColor: checked ? colors.purple : 'transparent' }} />
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 16 }}>I - am ready to start!</Text>
            </View>
            <View style={{ flex: 1 }} />
            <Button onPress={() => router.push("/(onboarding)/final")} disabled={!checked}>Continue</Button>
            <ConfettiCannon ref={confettiRef as any} count={120} origin={{ x: 0, y: 0 }} fadeOut autoStart={false} />
        </ScreenContainer>
    );
}


