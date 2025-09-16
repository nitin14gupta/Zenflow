import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StatusBar } from 'react-native';
import { colors } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { apiService } from '../../api/apiService';
import { useToast } from '../../context/ToastContext';

export default function Settings() {
    const { logout } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.replace('/');
    };

    const handleDeleteAllHabits = async () => {
        setIsDeleting(true);
        try {
            const response = await apiService.deleteAllPlans();
            if (response.success) {
                showToast('All habits and tasks deleted successfully', 'success');
                setShowDeleteModal(false);
            } else {
                showToast(response.error || 'Failed to delete habits', 'error');
            }
        } catch (error) {
            showToast('Failed to delete habits', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const SettingItem = ({ icon, title, onPress }: { icon: string; title: string; onPress: () => void }) => (
        <Pressable
            onPress={onPress}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 16,
                paddingHorizontal: 20,
                backgroundColor: 'white',
                borderRadius: 12,
                marginBottom: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 2
            }}
        >
            <Text style={{ fontSize: 20, marginRight: 16, color: '#6B7280' }}>{icon}</Text>
            <Text style={{
                fontFamily: 'Poppins_400Regular',
                fontSize: 16,
                color: '#111827',
                flex: 1
            }}>
                {title}
            </Text>
            <Text style={{ fontSize: 16, color: '#9CA3AF' }}>›</Text>
        </Pressable>
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
                    <Text style={{ fontSize: 18, color: '#6B7280' }}>✕</Text>
                </Pressable>
                <Text style={{
                    fontFamily: 'Poppins_700Bold',
                    fontSize: 24,
                    color: '#111827',
                    flex: 1
                }}>
                    Account Settings
                </Text>
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
                {/* Account Settings Section */}
                <View style={{ marginBottom: 32 }}>
                    <Text style={{
                        fontFamily: 'Poppins_700Bold',
                        fontSize: 20,
                        color: '#111827',
                        marginBottom: 16
                    }}>
                        Account Settings
                    </Text>

                    <SettingItem
                        icon="👤"
                        title="Account"
                        onPress={() => console.log('Account pressed')}
                    />
                    <SettingItem
                        icon="📄"
                        title="Subscription"
                        onPress={() => console.log('Subscription pressed')}
                    />
                </View>

                {/* Habit Management Section */}
                <View style={{ marginBottom: 32 }}>
                    <Text style={{
                        fontFamily: 'Poppins_700Bold',
                        fontSize: 20,
                        color: '#111827',
                        marginBottom: 16
                    }}>
                        Habit Management
                    </Text>

                    <SettingItem
                        icon="🗑️"
                        title="Delete All Habits"
                        onPress={() => setShowDeleteModal(true)}
                    />
                </View>

                {/* User Support Section */}
                <View style={{ marginBottom: 32 }}>
                    <Text style={{
                        fontFamily: 'Poppins_700Bold',
                        fontSize: 20,
                        color: '#111827',
                        marginBottom: 16
                    }}>
                        User Support
                    </Text>

                    <SettingItem
                        icon="📋"
                        title="Terms & Conditions"
                        onPress={() => router.push('/(settings)/terms')}
                    />
                    <SettingItem
                        icon="🛡️"
                        title="Privacy Policy"
                        onPress={() => router.push('/(settings)/privacy')}
                    />
                    <SettingItem
                        icon="❓"
                        title="Help Center"
                        onPress={() => router.push('/(settings)/help')}
                    />
                </View>

                {/* Logout Button */}
                <Pressable
                    onPress={handleLogout}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 12,
                        paddingVertical: 16,
                        alignItems: 'center',
                        marginBottom: 40,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 2,
                        elevation: 2
                    }}
                >
                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 16,
                        color: '#EF4444'
                    }}>
                        Logout
                    </Text>
                </Pressable>
            </ScrollView>

            {/* Delete All Habits Modal */}
            {showDeleteModal && (
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 20,
                        padding: 32,
                        width: '85%',
                        maxWidth: 400,
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontFamily: 'Poppins_700Bold',
                            fontSize: 20,
                            color: '#111827',
                            marginBottom: 16,
                            textAlign: 'center'
                        }}>
                            Delete All Habits
                        </Text>

                        <Text style={{
                            fontFamily: 'Poppins_400Regular',
                            fontSize: 16,
                            color: '#6B7280',
                            textAlign: 'center',
                            marginBottom: 24,
                            lineHeight: 24
                        }}>
                            This will delete all your habits and tasks for today, tomorrow, and in the future. This action cannot be undone.
                        </Text>

                        <Text style={{
                            fontFamily: 'Poppins_600SemiBold',
                            fontSize: 16,
                            color: '#EF4444',
                            marginBottom: 24,
                            textAlign: 'center'
                        }}>
                            Are you sure you want to continue?
                        </Text>

                        <View style={{ flexDirection: 'row', gap: 16, width: '100%' }}>
                            <Pressable
                                onPress={() => setShowDeleteModal(false)}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#F3F4F6',
                                    borderRadius: 12,
                                    paddingVertical: 16,
                                    alignItems: 'center'
                                }}
                            >
                                <Text style={{
                                    fontFamily: 'Poppins_600SemiBold',
                                    fontSize: 16,
                                    color: '#6B7280'
                                }}>
                                    Cancel
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={handleDeleteAllHabits}
                                disabled={isDeleting}
                                style={{
                                    flex: 1,
                                    backgroundColor: '#EF4444',
                                    borderRadius: 12,
                                    paddingVertical: 16,
                                    alignItems: 'center',
                                    opacity: isDeleting ? 0.7 : 1
                                }}
                            >
                                <Text style={{
                                    fontFamily: 'Poppins_600SemiBold',
                                    fontSize: 16,
                                    color: 'white'
                                }}>
                                    {isDeleting ? 'Deleting...' : 'Yes, Delete All'}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}
