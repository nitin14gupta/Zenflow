import React, { useEffect, useRef } from "react";
import { Animated, Image, Text } from "react-native";
import { ScreenContainer, colors } from "../../components/ui";
import { useRouter } from "expo-router";

export default function Splash() {
    const fade = useRef(new Animated.Value(0)).current;
    const router = useRouter();
    useEffect(() => {
        Animated.timing(fade, { toValue: 1, duration: 800, useNativeDriver: true }).start();
        const t = setTimeout(() => router.replace("/(onboarding)/age"), 2000);
        return () => clearTimeout(t);
    }, [fade, router]);

    return (
        <ScreenContainer style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary }}>
            <Animated.View style={{ opacity: fade, alignItems: 'center' }}>
                <Image source={require("../../../assets/images/favicon.png")} style={{ width: 96, height: 96, marginBottom: 16, borderRadius: 20 }} />
                <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 28, color: '#111827' }}>ZenFlow</Text>
            </Animated.View>
        </ScreenContainer>
    );
}


