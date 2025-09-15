import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";

type ToastType = "success" | "error" | "info";

type ToastContextValue = {
    show: (message: string, type?: ToastType, durationMs?: number) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState<string>("");
    const [type, setType] = useState<ToastType>("info");
    const opacity = useRef(new Animated.Value(0)).current;

    const show = useCallback((msg: string, t: ToastType = "info", durationMs = 2200) => {
        setMessage(msg);
        setType(t);
        Animated.sequence([
            Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
            Animated.delay(durationMs),
            Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
        ]).start();
    }, [opacity]);

    const value = useMemo(() => ({ show }), [show]);
    const bg = type === "success" ? "#10B981" : type === "error" ? "#EF4444" : "#111827";

    return (
        <ToastContext.Provider value={value}>
            {children}
            <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 40, alignItems: 'center' }}>
                <Animated.View style={{ opacity, transform: [{ translateY: opacity.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }], backgroundColor: bg, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, maxWidth: '90%' }}>
                    <Text style={{ color: 'white' }}>{message}</Text>
                </Animated.View>
            </View>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
};


