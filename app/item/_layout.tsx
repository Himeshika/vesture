import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';

export default function ItemLayout() {
  const router = useRouter();

  return (
    <Stack screenOptions={{
      headerStyle: {
        backgroundColor: Colors.surface,
      },
      headerTitleStyle: {
        color: Colors.textPrimary,
      },
      headerTintColor: Colors.textPrimary,
      headerLeft: () => (
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={{ paddingVertical: Spacing.xs, paddingRight: Spacing.md }}
        >
          <Feather name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      )
    }}>
      <Stack.Screen name="[id]" options={{ title: 'Garment Details' }} />
      <Stack.Screen name="edit/[id]" options={{ title: 'Edit Garment' }} />
    </Stack>
  );
}
