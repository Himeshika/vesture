import React, { useContext } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ItemsContext } from '@/context/ItemsContext';
import { CATEGORIES } from '@/constants/Categories';
import { ItemFormData } from '@/types';
import { useState } from 'react';
import InputField from '@/components/InputField';
import PrimaryButton from '@/components/PrimaryButton';
import ImagePickerButton from '@/components/ImagePickerButton';
import CategoryPill from '@/components/CategoryPill';
import globalStyles from '@/styles/globalStyles';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import { Alert, Text } from 'react-native';

export default function AddItemScreen() {
  const router = useRouter();
  const { createItem } = useContext(ItemsContext)!;

  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    description: '',
    category: CATEGORIES[0],
    size: '',
    color: '',
    images: [],
    pricePerDay: '',
    securityDeposit: '',
    ownerNotes: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.name || !formData.pricePerDay || !formData.securityDeposit) {
      Alert.alert('Missing Fields', 'Please fill in name, price and deposit.');
      return;
    }
    if (formData.images.length === 0) {
      Alert.alert('No Photo', 'Please add at least one photo of the item.');
      return;
    }

    setLoading(true);
    try {
      await createItem(formData);
      Alert.alert('Success', 'Item added to inventory!', [
        { text: 'OK', onPress: () => router.replace('/(admin)/inventory') }
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.screen} edges={[]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={globalStyles.heading2}>Add New Item</Text>

        <View style={{ marginTop: Spacing.lg, gap: Spacing.md }}>
          <ImagePickerButton
            onImageSelected={(uri) => setFormData(p => ({ ...p, images: [uri] }))}
            currentImageUri={formData.images[0]}
            label="Upload Item Photo *"
          />

          <InputField label="Item Name *" value={formData.name} onChangeText={(t) => setFormData(p => ({ ...p, name: t }))} />

          <Text style={globalStyles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: Spacing.sm }}>
            {CATEGORIES.map(cat => (
              <CategoryPill
                key={cat}
                label={cat}
                selected={formData.category === cat}
                onPress={() => setFormData(p => ({ ...p, category: cat }))}
              />
            ))}
          </ScrollView>

          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, marginRight: Spacing.sm }}>
              <InputField label="Size *" value={formData.size} onChangeText={(t) => setFormData(p => ({ ...p, size: t }))} />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <InputField label="Color" value={formData.color} onChangeText={(t) => setFormData(p => ({ ...p, color: t }))} />
            </View>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, marginRight: Spacing.sm }}>
              <InputField label="Price / Day ($) *" keyboardType="numeric" value={formData.pricePerDay} onChangeText={(t) => setFormData(p => ({ ...p, pricePerDay: t }))} />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <InputField label="Deposit ($) *" keyboardType="numeric" value={formData.securityDeposit} onChangeText={(t) => setFormData(p => ({ ...p, securityDeposit: t }))} />
            </View>
          </View>

          <InputField label="Description" multiline numberOfLines={4} value={formData.description} onChangeText={(t) => setFormData(p => ({ ...p, description: t }))} style={{ height: 100, textAlignVertical: 'top' }} />
          <InputField label="Internal Notes (Hidden from Customers)" value={formData.ownerNotes || ''} onChangeText={(t) => setFormData(p => ({ ...p, ownerNotes: t }))} />

          <View style={{ marginTop: Spacing.xl, marginBottom: 40 }}>
            <PrimaryButton title="Create Item" onPress={handleSave} loading={loading} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = { container: { padding: Spacing.screenPadding, paddingBottom: Spacing['2xl'] } } as const;
