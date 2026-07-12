import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { updateUserProfile } from '@/firebase/authService';
import { uploadImage } from '@/services/cloudinaryService';
import InputField from '@/components/InputField';
import PrimaryButton from '@/components/PrimaryButton';
import ImagePickerButton from '@/components/ImagePickerButton';
import globalStyles from '@/styles/globalStyles';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';

export default function EditProfileScreen() {
  const { userDoc, refreshUserDoc } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(userDoc?.name || '');
  const [phone, setPhone] = useState(userDoc?.phone || '');
  const [imageUri, setImageUri] = useState<string | undefined>(userDoc?.profileImage || undefined);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = userDoc?.profileImage;

      // Only upload if it's a new local URI (i.e. starts with file:// or similar, and differs from current)
      if (imageUri && imageUri !== userDoc?.profileImage) {
        finalImageUrl = await uploadImage(imageUri, 'avatars');
      }

      await updateUserProfile(userDoc!.uid, {
        name,
        phone: phone || undefined,
        profileImage: finalImageUrl,
      });

      await refreshUserDoc();
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={globalStyles.heading2}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.form}>
          <ImagePickerButton 
            onImageSelected={setImageUri}
            currentImageUri={imageUri}
            label="Change Profile Photo"
          />

          <InputField
            label="Name"
            value={name}
            onChangeText={(text) => { setName(text); setError(null); }}
            error={error || undefined}
          />

          <InputField
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+1 234 567 8900"
          />

          <View style={styles.actions}>
            <PrimaryButton 
              title="Save Changes" 
              onPress={handleSave} 
              loading={loading}
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.screenPadding,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing['2xl'],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  form: {
    gap: Spacing.md,
  },
  actions: {
    marginTop: Spacing.xl,
  },
});
