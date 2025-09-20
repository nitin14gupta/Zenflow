import React from 'react';
import { View, Text, Pressable, ScrollView, StatusBar } from 'react-native';
import { colors } from '../../components/ui';
import { useRouter } from 'expo-router';
import { Ionicons, AntDesign } from '@expo/vector-icons';
export default function Help() {
    const router = useRouter();

    const HelpItem = ({ question, answer }: { question: string; answer: string }) => (
        <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2
        }}>
            <Text style={{
                fontFamily: 'Poppins_600SemiBold',
                fontSize: 16,
                color: '#111827',
                marginBottom: 8
            }}>
                {question}
            </Text>
            <Text style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 14,
                color: '#6B7280',
                lineHeight: 20
            }}>
                {answer}
            </Text>
        </View>
    );

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
                    Help Center
                </Text>
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
                <View style={{ marginBottom: 24 }}>
                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 18,
                        color: '#111827',
                        marginBottom: 16
                    }}>
                        Frequently Asked Questions
                    </Text>

                    <HelpItem
                        question="How do I create my first daily plan?"
                        answer="Tap the + button at the bottom right of the screen to add a new task. You can set a specific time or add it to your 'Anytime' list for flexible tasks."
                    />

                    <HelpItem
                        question="Can I edit or delete my tasks?"
                        answer="Yes! Long press on any task to see options to edit or delete it. You can also tap the checkbox to mark tasks as complete."
                    />

                    <HelpItem
                        question="How do I change my account settings?"
                        answer="Tap the profile icon in the top right corner of the main screen to access your account settings and preferences."
                    />

                    <HelpItem
                        question="Is my data secure?"
                        answer="Absolutely! We use industry-standard encryption to protect your data. Your personal information is never shared with third parties without your consent."
                    />

                    <HelpItem
                        question="How do I reset my password?"
                        answer="On the login screen, tap 'Forgot Password?' and enter your email address. We'll send you a secure link to reset your password."
                    />

                    <HelpItem
                        question="Can I use ZenFlow offline?"
                        answer="Yes! You can view and manage your daily plans offline. Your data will sync automatically when you're back online."
                    />
                </View>

                <View style={{
                    backgroundColor: colors.mint,
                    borderRadius: 12,
                    padding: 20,
                    marginBottom: 20
                }}>
                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 16,
                        color: '#111827',
                        marginBottom: 8
                    }}>
                        Still need help?
                    </Text>
                    <Text style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 14,
                        color: '#374151',
                        marginBottom: 12
                    }}>
                        Contact our support team for personalized assistance.
                    </Text>
                    <Pressable style={{
                        backgroundColor: colors.purple,
                        paddingVertical: 12,
                        paddingHorizontal: 20,
                        borderRadius: 8,
                        alignSelf: 'flex-start'
                    }}>
                        <Text style={{
                            fontFamily: 'Poppins_600SemiBold',
                            fontSize: 14,
                            color: 'white'
                        }}>
                            Contact Support
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}
