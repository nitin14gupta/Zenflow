import React from 'react';
import { View, Text, Pressable, ScrollView, StatusBar } from 'react-native';
import { colors } from '../../components/ui';
import { useRouter } from 'expo-router';
import { Ionicons, AntDesign } from '@expo/vector-icons';

export default function Terms() {
    const router = useRouter();

    return (
        <View style={{ flex: 1, backgroundColor: '#FFF9F0' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFF9F0" />

            {/* Header */}
            <View style={{
                paddingTop: 25,
                paddingHorizontal: 20,
                paddingBottom: 20,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Pressable
                    onPress={() => router.back()}
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: colors.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 16
                    }}
                >
                    <Ionicons name="chevron-back-outline" size={20} color="#6B7280" />
                </Pressable>
                <Text style={{
                    fontFamily: 'Poppins_700Bold',
                    fontSize: 24,
                    color: '#111827',
                    flex: 1
                }}>
                    Terms & Conditions
                </Text>
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 24,
                    marginBottom: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 2,
                    elevation: 2
                }}>
                    <Text style={{
                        fontFamily: 'Poppins_700Bold',
                        fontSize: 20,
                        color: '#111827',
                        marginBottom: 16
                    }}>
                        Last Updated: September 16, 2025
                    </Text>

                    <Text style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 16,
                        color: '#374151',
                        lineHeight: 24,
                        marginBottom: 20
                    }}>
                        Welcome to ZenFlow! These Terms and Conditions ("Terms") govern your use of our mobile application and services.
                    </Text>

                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 18,
                        color: '#111827',
                        marginBottom: 12,
                        marginTop: 20
                    }}>
                        1. Acceptance of Terms
                    </Text>
                    <Text style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 14,
                        color: '#6B7280',
                        lineHeight: 20,
                        marginBottom: 16
                    }}>
                        By downloading, installing, or using ZenFlow, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our app.
                    </Text>

                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 18,
                        color: '#111827',
                        marginBottom: 12,
                        marginTop: 20
                    }}>
                        2. Description of Service
                    </Text>
                    <Text style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 14,
                        color: '#6B7280',
                        lineHeight: 20,
                        marginBottom: 16
                    }}>
                        ZenFlow is a personal growth and habit tracking application designed to help users build better habits, organize their daily activities, and achieve their personal goals.
                    </Text>

                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 18,
                        color: '#111827',
                        marginBottom: 12,
                        marginTop: 20
                    }}>
                        3. User Accounts
                    </Text>
                    <Text style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 14,
                        color: '#6B7280',
                        lineHeight: 20,
                        marginBottom: 16
                    }}>
                        You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                    </Text>

                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 18,
                        color: '#111827',
                        marginBottom: 12,
                        marginTop: 20
                    }}>
                        4. Privacy
                    </Text>
                    <Text style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 14,
                        color: '#6B7280',
                        lineHeight: 20,
                        marginBottom: 16
                    }}>
                        Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the app.
                    </Text>

                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 18,
                        color: '#111827',
                        marginBottom: 12,
                        marginTop: 20
                    }}>
                        5. Contact Information
                    </Text>
                    <Text style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 14,
                        color: '#6B7280',
                        lineHeight: 20,
                        marginBottom: 20
                    }}>
                        If you have any questions about these Terms, please contact us at support@zenflow.app
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
