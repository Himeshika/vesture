import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ItemsContext } from '@/context/ItemsContext';
import { ItemFormData } from '@/types';
import InputField from '@/components/InputField';
import PrimaryButton from '@/components/PrimaryButton';
import ImagePickerButton from '@/components/ImagePickerButton';
import { CATEGORIES } from '@/constants/Categories';
import globalStyles from '@/styles/globalStyles';
import Spacing from '@/constants/Spacing';
import CategoryPill from '@/components/CategoryPill';

export default function EditItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // "new" implies creation mode
  const isNew = id === 'new';
  const router = useRouter();
  
  const { getItemById, createItem, updateItem } = useContext(ItemsContext)!;

  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    description: '',
    category: CATEGORIES[0],
    size: '',
    color: '',
    images: [],
    pricePerDay: '',
    securityDeposit: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      const existing = getItemById(id);
      if (existing) {
        setFormData({
          name: existing.name,
          description: existing.description,
          category: existing.category,
          size: existing.size,
          color: existing.color || '',
          images: existing.images,
          pricePerDay: existing.pricePerDay.toString(),
          securityDeposit: existing.securityDeposit.toString(),
          ownerNotes: existing.ownerNotes || undefined,
        });
      }
    }
  }, [id, isNew, getItemById]);

  const handleSave = async () => {
    if (!formData.name || !formData.pricePerDay || !formData.securityDeposit) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    if (formData.images.length === 0) {
      Alert.alert('Error', 'Please add at least one image.');
      return;
    }

    setLoading(true);
    try {
      if (isNew) {
        await createItem(formData);
        Alert.alert('Success', 'Item created successfully', [{ text: 'OK', onPress: () => router.back() }]);
      } else {
        await updateItem(id, formData);
        Alert.alert('Success', 'Item updated successfully', [{ text: 'OK', onPress: () => router.back() }]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = (uri: string) => {
    // Overwriting array with 1 image for simplicity as defined in MVP, or appending
    setFormData(prev => ({ ...prev, images: [uri] }));
  };

  return (
    <SafeAreaView style={globalStyles.screen} edges={[]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={globalStyles.heading2}>{isNew ? 'Add New Item' : 'Edit Item'}</Text>

        <View style={styles.formSection}>
          <ImagePickerButton 
            onImageSelected={handleAddImage} 
            label="Upload Item Photo"
            currentImageUri={formData.images[0]} 
          />

          <InputField 
            label="Item Name *"
            value={formData.name}
            onChangeText={(t) => setFormData(p => ({...p, name: t}))}
          />

          <Text style={globalStyles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.md }}>
            {CATEGORIES.map(cat => (
              <CategoryPill 
                key={cat} 
                label={cat} 
                selected={formData.category === cat}
                onPress={() => setFormData(p => ({...p, category: cat}))} 
              />
            ))}
          </ScrollView>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: Spacing.sm }}>
              <InputField 
                label="Size *"
                value={formData.size}
                onChangeText={(t) => setFormData(p => ({...p, size: t}))}
              />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <InputField 
                label="Color"
                value={formData.color}
                onChangeText={(t) => setFormData(p => ({...p, color: t}))}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: Spacing.sm }}>
              <InputField 
                label="Price / Day ($) *"
                keyboardType="numeric"
                value={formData.pricePerDay}
                onChangeText={(t) => setFormData(p => ({...p, pricePerDay: t}))}
              />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <InputField 
                label="Deposit ($) *"
                keyboardType="numeric"
                value={formData.securityDeposit}
                onChangeText={(t) => setFormData(p => ({...p, securityDeposit: t}))}
              />
            </View>
          </View>

          <InputField 
            label="Description"
            multiline
            numberOfLines={4}
            value={formData.description}
            onChangeText={(t) => setFormData(p => ({...p, description: t}))}
            style={{ height: 100, textAlignVertical: 'top' }}
          />
          
          <InputField 
            label="Admin Notes (Hidden)"
            multiline
            numberOfLines={2}
            value={formData.ownerNotes || ''}
            onChangeText={(t) => setFormData(p => ({...p, ownerNotes: t}))}
          />

          <View style={{ marginTop: Spacing.xl, marginBottom: 40 }}>
            <PrimaryButton 
              title={isNew ? "Create Item" : "Save Changes"} 
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
  formSection: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
  }
});
