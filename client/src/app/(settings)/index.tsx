import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StatusBar } from 'react-native';
import { colors } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { apiService } from '../../api/apiService';
import { useToast } from '../../context/ToastContext';
import { Ionicons, AntDesign } from '@expo/vector-icons';

export default function Settings() {
    const { logout } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showAccountModal, setShowAccountModal] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.replace('/(auth)/login');
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
                paddingVertical: 18,
                paddingHorizontal: 20,
                backgroundColor: 'white',
                borderRadius: 16,
                marginBottom: 12,
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
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: '#F8FAFC',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16
            }}>
                <Text style={{ fontSize: 20, color: '#6B7280' }}>{icon}</Text>
            </View>
            <Text style={{
                fontFamily: 'Poppins_500Medium',
                fontSize: 16,
                color: '#111827',
                flex: 1
            }}>
                {title}
            </Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#6B7280" />
        </Pressable>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
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
                    }}>
                        Settings
                    </Text>
                    <Text style={{
                        fontFamily: 'Poppins_400Regular',
                        fontSize: 14,
                        color: '#6B7280'
                    }}>
                        Manage your account and preferences
                    </Text>
                </View>
            </View>

            <ScrollView style={{ flex: 1, paddingHorizontal: 24 }}>
                {/* Account Settings Section */}
                <View style={{ marginTop: 10, marginBottom: 12 }}>
                    <Text style={{
                        fontFamily: 'Poppins_700Bold',
                        fontSize: 18,
                        color: '#111827',
                        marginBottom: 16
                    }}>
                        Account
                    </Text>

                    <SettingItem
                        icon="👤"
                        title="Account"
                        onPress={() => setShowAccountModal(true)}
                    />
                    <SettingItem
                        icon="📄"
                        title="Subscription"
                        onPress={() => router.push('/(settings)/subscription')}
                    />
                </View>

                {/* Habit Management Section */}
                <View style={{ marginBottom: 32 }}>
                    <Text style={{
                        fontFamily: 'Poppins_700Bold',
                        fontSize: 18,
                        color: '#111827',
                        marginBottom: 16
                    }}>
                        Data Management
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
                        fontSize: 18,
                        color: '#111827',
                        marginBottom: 16
                    }}>
                        Support & Legal
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
                        borderRadius: 16,
                        paddingVertical: 18,
                        alignItems: 'center',
                        marginBottom: 40,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.05,
                        shadowRadius: 4,
                        elevation: 2,
                        borderWidth: 1,
                        borderColor: '#FEE2E2'
                    }}
                >
                    <Text style={{
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 16,
                        color: '#EF4444'
                    }}>
                        Sign Out
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
            {/* Account Modal */}
            {showAccountModal && (
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'flex-end'
                }}>
                    <Pressable style={{ flex: 1 }} onPress={() => setShowAccountModal(false)} />
                    <View style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 }}>
                        <View style={{ width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />

                        <Pressable
                            onPress={() => { setShowAccountModal(false); router.push('/(auth)/forgot'); }}
                            style={{ backgroundColor: 'white', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 24, paddingVertical: 16, alignItems: 'center', marginBottom: 16 }}
                        >
                            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: '#111827' }}>Change Password</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => { setShowAccountModal(false); setShowDeleteModal(true); }}
                            style={{ backgroundColor: 'white', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 24, paddingVertical: 16, alignItems: 'center' }}
                        >
                            <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: '#111827' }}>Request Account Deletion</Text>
                        </Pressable>

                        <Text style={{ textAlign: 'center', color: '#9CA3AF', marginTop: 16, fontFamily: 'Poppins_400Regular', fontSize: 12 }}>Version 2.0.31444{"\n"}User settings</Text>
                    </View>
                </View>
            )}
        </View>
    );
}
