import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';

interface ImagePickerButtonProps {
  onImageSelected: (uri: string) => void;
  currentImageUri?: string;
  label?: string;
}

export default function ImagePickerButton({ onImageSelected, currentImageUri, label = 'Add Photo' }: ImagePickerButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePickImage = async () => {
    setIsLoading(true);
    
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert("You've refused to allow this app to access your photos!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 5],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onImageSelected(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image', error);
      alert('An error occurred while picking the image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.pickerArea} 
        onPress={handlePickImage}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={Colors.primary} />
        ) : currentImageUri ? (
          <Image source={{ uri: currentImageUri }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Feather name="camera" size={32} color={Colors.textMuted} />
            <Text style={styles.label}>{label}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  pickerArea: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.surface,
    borderRadius: Spacing.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: Spacing.sm,
    fontSize: Typography.sm,
    color: Colors.textMuted,
  },
});
