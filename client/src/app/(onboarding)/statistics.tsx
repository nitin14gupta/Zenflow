import React from "react";
import { Image, Text, View } from "react-native";
import { Button, ProgressBar, ScreenContainer, Subtitle, Title, colors } from "../../components/ui";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useRouter } from "expo-router";

export default function Statistics() {
    const router = useRouter();
    const line = useRef(new Animated.Value(0)).current;
    useEffect(() => {
        Animated.timing(line, { toValue: 1, duration: 800, useNativeDriver: false }).start();
    }, [line]);
    return (
        <ScreenContainer>
            <ProgressBar progress={12 / 19} />
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <Image source={{ uri: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=600&q=80&auto=format&fit=crop" }} style={{ width: '100%', height: 160, borderRadius: 12, marginBottom: 8 }} />
                <View style={{ width: '100%', height: 140, backgroundColor: '#F3F4F6', borderRadius: 12, padding: 16, justifyContent: 'center' }}>
                    <Animated.View style={{ height: 4, width: line.interpolate({ inputRange: [0, 1], outputRange: ['10%', '90%'] }), backgroundColor: colors.purple, borderRadius: 999 }} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: '#6B7280' }}>Week 1</Text>
                        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: '#6B7280' }}>Week 4</Text>
                    </View>
                </View>
            </View>
            <Title>Build Good Habits and Have More Great Days!</Title>
            <Subtitle>Good habits will help you reach your goals, develop both personally and professionally, and feel fulfilled. According to statistics, 86% of ZenFlow users responded that building good habits makes them happier and have more great days.</Subtitle>
            <View style={{ flex: 1 }} />
            <Button onPress={() => router.push("/(onboarding)/desires")}>Continue</Button>
        </ScreenContainer>
    );
}


