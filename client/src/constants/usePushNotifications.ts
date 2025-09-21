import React, { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import Constants from "expo-constants";

import { Platform } from "react-native";
import apiService from "../api/apiService";
import { useAuth } from "../context/AuthContext";

export interface PushNotificationState {
    expoPushToken?: Notifications.ExpoPushToken;
    notification?: Notifications.Notification;
}

export const usePushNotifications = (): PushNotificationState => {
    const { user } = useAuth();
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: true,
            shouldSetBadge: true,
            shouldShowBanner: true,
            shouldShowList: true,
        }),
    });

    const [expoPushToken, setExpoPushToken] = useState<
        Notifications.ExpoPushToken | undefined
    >();

    const [notification, setNotification] = useState<
        Notifications.Notification | undefined
    >();

    const notificationListener = useRef<Notifications.Subscription | null>(null);
    const responseListener = useRef<Notifications.Subscription | null>(null);

    async function registerForPushNotificationsAsync() {
        let token;
        if (Device.isDevice) {
            // Android 13+: create a channel BEFORE requesting permissions or tokens
            if (Platform.OS === "android") {
                try {
                    await Notifications.setNotificationChannelAsync("default", {
                        name: "default",
                        importance: Notifications.AndroidImportance.MAX,
                        vibrationPattern: [0, 250, 250, 250],
                        lightColor: "#FF231F7C",
                    });
                } catch { }
            }
            const { status: existingStatus } =
                await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== "granted") {
                alert("Failed to get push token for push notification");
                return;
            }

            token = await Notifications.getExpoPushTokenAsync();
        } else {
            alert("Must be using a physical device for Push notifications");
        }

        return token;
    }

    useEffect(() => {
        registerForPushNotificationsAsync().then((token) => {
            setExpoPushToken(token);
            try {
                if (token && (token as any).data) {
                    console.log('Expo push token:', (token as any).data);
                }
            } catch { }
        });

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                setNotification(notification);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener((response) => {
                console.log(response);
            });

        return () => {
            try { notificationListener.current?.remove(); } catch { }
            try { responseListener.current?.remove(); } catch { }
        };
    }, []);

    // Register token with backend whenever it changes or user logs in
    useEffect(() => {
        const registerToken = async () => {
            try {
                if (expoPushToken && (expoPushToken as any).data) {
                    const tokenString = (expoPushToken as any).data as string;
                    await apiService.registerPushToken(tokenString, user?.id);
                }
            } catch (e) {
                console.log("Push token register error", e);
            }
        };
        registerToken();
    }, [expoPushToken, user?.id]);

    return {
        expoPushToken,
        notification,
    };
};