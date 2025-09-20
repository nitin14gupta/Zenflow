import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, StatusBar } from 'react-native';
// import { colors } from '../../components/ui';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, AntDesign } from '@expo/vector-icons';

const suggestions = [
    { id: '1', emoji: '👗', title: 'Organize wardrobe' },
    { id: '2', emoji: '🪟', title: 'Wash windows' },
    { id: '3', emoji: '💡', title: 'Mentor Someone' },
    { id: '4', emoji: '🛋️', title: 'Vacuum sofa' },
    { id: '5', emoji: '💖', title: 'Do a random act of kindness' },
];

export default function CreatePlan() {
    const router = useRouter();
    const [planName, setPlanName] = useState('Take a hot bubble bath');

    const handleSuggestionPress = (suggestion: any) => {
        setPlanName(suggestion.title);
    };

    const handleContinue = () => {
        router.push({
            pathname: '/(hobbies)/details',
            params: { planName }
        });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

            {/* Header */}
            <View style={{
                paddingTop: 10,
                paddingHorizontal: 24,
                paddingBottom: 14,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'white',
                borderBottomWidth: 1,
                borderBottomColor: '#E5E7EB'
            }}>
                <Pressable
                    onPress={() => router.back()}
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        backgroundColor: '#F3F4F6',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 16
                    }}
                >
                    <Ionicons name="arrow-back-outline" size={20} color="#6B7280" />
                </Pressable>
                <View style={{ flex: 1 }}>
                    <Text style={{
                        fontFamily: 'Poppins_700Bold',
                        fontSize: 28,
                        color: '#111827',
                        marginBottom: 4
                    }}>
                        Create Habit
                    </Text>
                    <Text style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 14,
                        color: '#6B7280'
                    }}>
                        Build your personalized routine
                    </Text>
                </View>
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 24 }}>
                {/* Input Field */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 20,
                    padding: 14,
                    marginTop: 20,
                    marginBottom: 32,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4
                }}>
                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 16,
                        color: '#374151',
                        marginBottom: 12
                    }}>
                        What would you like to do?
                    </Text>
                    <TextInput
                        value={planName}
                        onChangeText={setPlanName}
                        placeholder="Enter your habit or activity..."
                        style={{
                            fontFamily: 'Poppins_400Regular',
                            fontSize: 16,
                            color: '#111827',
                            minHeight: 50,
                            backgroundColor: '#F8FAFC',
                            borderRadius: 12,
                            paddingHorizontal: 16,
                            paddingVertical: 12
                        }}
                        placeholderTextColor="#9CA3AF"
                        multiline
                    />
                </View>

                {/* Suggestions */}
                <View style={{ marginBottom: 32 }}>
                    <Text style={{
                        fontFamily: 'Poppins_700Bold',
                        fontSize: 18,
                        color: '#111827',
                        marginBottom: 16
                    }}>
                        Popular Suggestions
                    </Text>

                    <View style={{ gap: 12 }}>
                        {suggestions.map((suggestion) => (
                            <Pressable
                                key={suggestion.id}
                                onPress={() => handleSuggestionPress(suggestion)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: 'white',
                                    borderRadius: 50,
                                    padding: 10,
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.05,
                                    shadowRadius: 4,
                                    elevation: 2,
                                    borderWidth: 1,
                                    borderColor: '#F3F4F6'
                                }}
                            >
                                <View style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 24,
                                    backgroundColor: '#F8FAFC',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 16
                                }}>
                                    <Text style={{ fontSize: 24 }}>{suggestion.emoji}</Text>
                                </View>
                                <Text style={{
                                    fontFamily: 'Poppins_500Medium',
                                    fontSize: 16,
                                    color: '#111827',
                                    flex: 1
                                }}>
                                    {suggestion.title}
                                </Text>
                                <View style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 18,
                                    backgroundColor: '#F3F4F6',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Text style={{ fontSize: 18, color: '#6B7280' }}>+</Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Continue Button */}
                <Pressable
                    onPress={handleContinue}
                    style={{
                        backgroundColor: '#111827',
                        borderRadius: 16,
                        paddingVertical: 18,
                        alignItems: 'center',
                        marginBottom: 40,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2,
                        shadowRadius: 8,
                        elevation: 4
                    }}
                >
                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 16,
                        color: 'white'
                    }}>
                        Continue to Setup
                    </Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}
