import React from "react";
import { Image, Text, View } from "react-native";
import { Button, ProgressBar, ScreenContainer, Subtitle, Title, colors } from "../../components/ui";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useRouter } from "expo-router";

export default function Motivation() {
    const router = useRouter();
    const bar1 = useRef(new Animated.Value(20)).current;
    const bar2 = useRef(new Animated.Value(50)).current;
    const bar3 = useRef(new Animated.Value(10)).current;
    useEffect(() => {
        Animated.stagger(150, [
            Animated.spring(bar1, { toValue: 80, useNativeDriver: false }),
            Animated.spring(bar2, { toValue: 120, useNativeDriver: false }),
            Animated.spring(bar3, { toValue: 60, useNativeDriver: false }),
        ]).start();
    }, [bar1, bar2, bar3]);
    return (
        <ScreenContainer>
            <ProgressBar progress={9 / 19} />
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 40, marginBottom: 8 }}>🎯</Text>
                <View style={{ width: '100%', height: 160, backgroundColor: '#F3F4F6', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around' }}>
                    <Animated.View style={{ width: 24, height: bar1, backgroundColor: colors.mint, borderRadius: 8 }} />
                    <Animated.View style={{ width: 24, height: bar2, backgroundColor: colors.blue, borderRadius: 8 }} />
                    <Animated.View style={{ width: 24, height: bar3, backgroundColor: colors.coral, borderRadius: 8 }} />
                </View>
            </View>
            <Title>Motivation is your key to success!</Title>
            <Subtitle>You're twice as motivated when you see your goals clearly. So use your growth plan to keep them in focus even when the going gets tough.</Subtitle>
            <View style={{ flex: 1 }} />
            <Button onPress={() => router.push("/(onboarding)/distractions")}>Continue</Button>
        </ScreenContainer>
    );
}


