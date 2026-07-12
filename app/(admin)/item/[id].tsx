import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ItemsContext } from '@/context/ItemsContext';
import StatusBadge from '@/components/StatusBadge';
import ImageCarousel from '@/components/ImageCarousel';
import PrimaryButton from '@/components/PrimaryButton';
import ReviewSection from '@/components/ReviewSection';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import globalStyles from '@/styles/globalStyles';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';

export default function AdminItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getItemById, deleteItem } = useContext(ItemsContext)!;

  const item = getItemById(id as string);

  if (!item) return <EmptyState message="Item not found" actionLabel="Go Back" onAction={() => router.back()} />;

  const handleDelete = () => {
    Alert.alert('Delete Item', 'Are you sure? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteItem(item.id);
            router.replace('/(admin)/inventory');
          } catch (err: any) {
            Alert.alert('Error', err.message || 'Failed to delete item');
          }
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={globalStyles.screen} edges={[]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <ImageCarousel images={item.images} />

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.name}>{item.name}</Text>
            <StatusBadge status={item.status} />
          </View>

          <Text style={styles.meta}>{item.category} • Size {item.size} • {item.color}</Text>

          <View style={styles.priceRow}>
            <View style={styles.priceBox}>
              <Text style={styles.priceLabel}>Per Day</Text>
              <Text style={styles.priceVal}>${item.pricePerDay.toFixed(2)}</Text>
            </View>
            <View style={styles.priceBox}>
              <Text style={styles.priceLabel}>Deposit</Text>
              <Text style={styles.priceVal}>${item.securityDeposit.toFixed(2)}</Text>
            </View>
          </View>

          <Text style={globalStyles.body}>{item.description}</Text>

          {item.ownerNotes && (
            <View style={styles.ownerNotes}>
              <Text style={globalStyles.label}>Internal Notes</Text>
              <Text style={globalStyles.body}>{item.ownerNotes}</Text>
            </View>
          )}

          <View style={styles.divider} />
          <ReviewSection itemId={item.id} />
        </View>
      </ScrollView>

      {/* Floating Action Bar */}
      <View style={styles.bottomBar}>
        <PrimaryButton
          title="Edit Details"
          icon="edit-2"
          onPress={() => router.push(`/item/edit/${item.id}`)}
          style={{ flex: 1, marginRight: Spacing.md }}
        />
        <PrimaryButton
          title="Delete"
          icon="trash-2"
          variant="ghost"
          onPress={handleDelete}
          style={{ width: 110, backgroundColor: `${Colors.error}20` }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.screenPadding,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  name: {
    flex: 1,
    fontSize: Typography['2xl'],
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  meta: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  priceRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  priceBox: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Spacing.radiusMd,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  priceVal: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.accent,
  },
  ownerNotes: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: Spacing.radiusMd,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.xl,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.screenPadding,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
