import React, { PropsWithChildren, useEffect, useRef } from "react";
import { Pressable, Text, View, ViewProps, Animated } from "react-native";
import * as Haptics from "expo-haptics";

export const colors = {
    primary: "#E8E4F3",
    coral: "#FFB5A7",
    mint: "#A8E6CF",
    blue: "#B8D8E7",
    cream: "#FFF9F0",
    purple: "#6B46C1",
    orange: "#FF8A65",
};

export const ScreenContainer: React.FC<PropsWithChildren<{ style?: ViewProps["style"] }>> = ({ children, style }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(10)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 6 }),
        ]).start();
    }, [opacity, translateY]);

    return (
        <Animated.View style={[{ flex: 1, backgroundColor: colors.cream, paddingHorizontal: 20, paddingTop: 48, paddingBottom: 24, opacity, transform: [{ translateY }] }, style]}>
            {children}
        </Animated.View>
    );
};

type ButtonProps = PropsWithChildren<{ onPress?: () => void; variant?: "primary" | "secondary"; disabled?: boolean; }>
export const Button: React.FC<ButtonProps> = ({ children, onPress, variant = "primary", disabled }) => {
    const scale = useRef(new Animated.Value(1)).current;
    const bg = variant === "primary" ? colors.purple : colors.blue;
    const text = "#fff";
    const press = () => {
        Haptics.selectionAsync();
        onPress?.();
    };
    return (
        <Pressable
            onPressIn={() => Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }).start()}
            onPressOut={() => Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }).start()}
            onPress={press}
            disabled={disabled}
        >
            <Animated.View style={{ transform: [{ scale }], backgroundColor: bg, paddingVertical: 14, borderRadius: 12, shadowOpacity: 0.15, shadowRadius: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 } }}>
                <Text style={{ color: text, textAlign: "center", fontFamily: "Poppins_600SemiBold", fontSize: 16 }}>{children}</Text>
            </Animated.View>
        </Pressable>
    );
};

type CardOptionProps = { label: string; selected?: boolean; onPress?: () => void; emoji?: string };
export const CardOption: React.FC<CardOptionProps> = ({ label, selected, onPress, emoji }) => {
    const scale = useRef(new Animated.Value(1)).current;
    const bg = selected ? colors.mint : colors.primary;
    const border = selected ? colors.purple : "transparent";
    return (
        <Pressable
            onPressIn={() => Animated.spring(scale, { toValue: 0.98, useNativeDriver: true }).start()}
            onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
            onPress={() => { Haptics.selectionAsync(); onPress?.(); }}
            style={{ marginVertical: 8 }}
        >
            <Animated.View style={{ transform: [{ scale }], backgroundColor: bg, borderRadius: 12, padding: 16, borderWidth: 2, borderColor: border }}>
                <Text style={{ fontFamily: "Poppins_400Regular", fontSize: 16 }}>{emoji ? `${emoji} ${label}` : label}</Text>
            </Animated.View>
        </Pressable>
    );
};

export const Title: React.FC<PropsWithChildren> = ({ children }) => (
    <Text style={{ fontFamily: "Poppins_700Bold", fontSize: 24, marginBottom: 8 }}>{children}</Text>
);

export const Subtitle: React.FC<PropsWithChildren> = ({ children }) => (
    <Text style={{ fontFamily: "Poppins_400Regular", fontSize: 16, color: "#374151" }}>{children}</Text>
);

export const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
    const pct = Math.max(0, Math.min(1, progress));
    return (
        <View style={{ height: 8, backgroundColor: "#E5E7EB", borderRadius: 999, overflow: "hidden", marginBottom: 24 }}>
            <View style={{ width: `${pct * 100}%`, backgroundColor: colors.purple, height: 8 }} />
        </View>
    );
};


