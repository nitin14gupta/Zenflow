import React from 'react';
import { View, Text, Pressable, ScrollView, StatusBar } from 'react-native';
import { colors } from '../../components/ui';
import { useRouter } from 'expo-router';
import { Ionicons, AntDesign } from '@expo/vector-icons';

export default function Privacy() {
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
                    Privacy Policy
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
                        At ZenFlow, we are committed to protecting your privacy and ensuring the security of your personal information.
                    </Text>

                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 18,
                        color: '#111827',
                        marginBottom: 12,
                        marginTop: 20
                    }}>
                        Information We Collect
                    </Text>
                    <Text style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 14,
                        color: '#6B7280',
                        lineHeight: 20,
                        marginBottom: 16
                    }}>
                        • Account information (email address, password){'\n'}
                        • Onboarding data you provide during setup{'\n'}
                        • Usage data and app interactions{'\n'}
                        • Device information and technical data
                    </Text>

                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 18,
                        color: '#111827',
                        marginBottom: 12,
                        marginTop: 20
                    }}>
                        How We Use Your Information
                    </Text>
                    <Text style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 14,
                        color: '#6B7280',
                        lineHeight: 20,
                        marginBottom: 16
                    }}>
                        • To provide and improve our services{'\n'}
                        • To personalize your experience{'\n'}
                        • To send you important updates and notifications{'\n'}
                        • To analyze app usage and performance
                    </Text>

                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 18,
                        color: '#111827',
                        marginBottom: 12,
                        marginTop: 20
                    }}>
                        Data Security
                    </Text>
                    <Text style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 14,
                        color: '#6B7280',
                        lineHeight: 20,
                        marginBottom: 16
                    }}>
                        We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                    </Text>

                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 18,
                        color: '#111827',
                        marginBottom: 12,
                        marginTop: 20
                    }}>
                        Your Rights
                    </Text>
                    <Text style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 14,
                        color: '#6B7280',
                        lineHeight: 20,
                        marginBottom: 16
                    }}>
                        You have the right to access, update, or delete your personal information. You can also opt out of certain communications from us.
                    </Text>

                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 18,
                        color: '#111827',
                        marginBottom: 12,
                        marginTop: 20
                    }}>
                        Contact Us
                    </Text>
                    <Text style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 14,
                        color: '#6B7280',
                        lineHeight: 20,
                        marginBottom: 20
                    }}>
                        If you have any questions about this Privacy Policy, please contact us at privacy@zenflow.app
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
