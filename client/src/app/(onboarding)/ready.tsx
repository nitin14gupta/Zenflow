import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Button, ProgressBar, ScreenContainer, Title, colors } from "../../components/ui";
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
            <Title>Are you ready to start?</Title>
            <View style={{ marginTop: 24, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Pressable onPress={() => setChecked(!checked)} style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.purple, alignItems: 'center', justifyContent: 'center', backgroundColor: checked ? colors.purple : 'transparent' }} />
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 16 }}>I'm ready to start!</Text>
            </View>
            <View style={{ flex: 1 }} />
            <Button onPress={() => router.push("/(onboarding)/final")}>Continue</Button>
            <ConfettiCannon ref={confettiRef as any} count={120} origin={{ x: 0, y: 0 }} fadeOut autoStart={false} />
        </ScreenContainer>
    );
}


