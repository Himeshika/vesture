import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import ConfirmModal from '@/components/ConfirmModal';
import PrimaryButton from '@/components/PrimaryButton';
import globalStyles from '@/styles/globalStyles';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';

export default function ProfileScreen() {
  const { userDoc, logout } = useAuth();
  const router = useRouter();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = async () => {
    setLogoutModalVisible(false);
    try {
      await logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error(error);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <SafeAreaView style={globalStyles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={globalStyles.heading1}>Profile</Text>

        <View style={styles.header}>
          {userDoc?.profileImage ? (
            <Image source={{ uri: userDoc.profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.initials}>{userDoc?.name ? getInitials(userDoc.name) : 'U'}</Text>
            </View>
          )}
          
          <View style={styles.userInfo}>
            <Text style={styles.name}>{userDoc?.name}</Text>
            <Text style={styles.email}>{userDoc?.email}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => router.push('/(customer)/edit-profile')}
          >
            <View style={styles.menuIconContainer}>
              <Feather name="edit-3" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Edit Profile</Text>
            <Feather name="chevron-right" size={20} color={Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Coming Soon', 'Settings will be available soon.')}>
            <View style={styles.menuIconContainer}>
              <Feather name="settings" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Settings</Text>
            <Feather name="chevron-right" size={20} color={Colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Coming Soon', 'FAQ will be available soon.')}>
            <View style={styles.menuIconContainer}>
              <Feather name="help-circle" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.menuText}>Help & FAQ</Text>
            <Feather name="chevron-right" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        <View style={styles.logoutWrapper}>
          <PrimaryButton 
            title="Sign Out" 
            onPress={() => setLogoutModalVisible(true)} 
            variant="outlined" 
            icon="log-out"
          />
        </View>
      </ScrollView>

      <ConfirmModal
        visible={logoutModalVisible}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmLabel="Sign Out"
        confirmVariant="danger"
        onConfirm={handleLogout}
        onCancel={() => setLogoutModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.screenPadding,
    paddingTop: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.2xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surfaceHighlight,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: Typography.2xl,
    color: Colors.background,
    fontWeight: Typography.bold,
  },
  userInfo: {
    marginLeft: Spacing.lg,
    flex: 1,
  },
  name: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.radiusLg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${Colors.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuText: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
  },
  logoutWrapper: {
    marginTop: Spacing.2xl,
  },
});
