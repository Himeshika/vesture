import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ItemsContext } from '@/context/ItemsContext';
import { WishlistContext } from '@/context/WishlistContext';
import { useAuth } from '@/hooks/useAuth';
import { useAvailability } from '@/hooks/useAvailability';
import { usePriceCalculator } from '@/hooks/usePriceCalculator';
import { RentalsContext } from '@/context/RentalsContext';
import { ClothingItem } from '@/types';
import ImageCarousel from '@/components/ImageCarousel';
import AvailabilityCalendar from '@/components/AvailabilityCalendar';
import ReviewSection from '@/components/ReviewSection';
import PrimaryButton from '@/components/PrimaryButton';
import StatusBadge from '@/components/StatusBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import globalStyles from '@/styles/globalStyles';

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { role } = useAuth();
  
  const { getItemById, deleteItem } = useContext(ItemsContext)!;
  const { toggleWishlist, isWishlisted } = useContext(WishlistContext)!;
  const { createRentalRequest } = useContext(RentalsContext)!;

  const [item, setItem] = useState<ClothingItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [requestLoading, setRequestLoading] = useState(false);

  const { markedDates, isRangeAvailable, isLoading: calendarLoading } = useAvailability(item?.id || '');
  const { total, days } = usePriceCalculator(item, startDate, endDate);

  useEffect(() => {
    if (id) {
      const foundItem = getItemById(id);
      setItem(foundItem || null);
      setLoading(false);
    }
  }, [id, getItemById]);

  const handleDateSelect = (date: string) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else {
      if (date < startDate) {
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const handleBook = async () => {
    if (!item || !startDate || !endDate) return;
    
    if (!isRangeAvailable(startDate, endDate)) {
      Alert.alert('Unavailable', 'Some dates in your selection are already booked.');
      return;
    }

    setRequestLoading(true);
    try {
      await createRentalRequest(item, startDate, endDate);
      Alert.alert('Success', 'Rental request submitted successfully!', [
        { text: 'View Rentals', onPress: () => router.replace('/(customer)/rentals') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit request');
    } finally {
      setRequestLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to permanently delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await deleteItem(item!.id);
          router.back();
        } catch (error: any) {
          Alert.alert('Error', 'Failed to delete item.');
        }
      }}
    ]);
  };

  if (loading) return <LoadingSpinner fullScreen />;
  
  if (!item) {
    return <EmptyState message="Item not found" actionLabel="Go Back" onAction={() => router.back()} />;
  }

  const isAdmin = role === 'admin';
  const wishlisted = isWishlisted(item.id);

  return (
    <SafeAreaView style={globalStyles.screen} edges={[]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <ImageCarousel images={item.images} />

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.category}>{item.category} • Size {item.size} • {item.color}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>${item.pricePerDay.toFixed(2)}</Text>
              <Text style={styles.perDay}>/ day</Text>
            </View>
          </View>

          {isAdmin && (
            <View style={{ marginBottom: Spacing.md }}>
              <StatusBadge status={item.status} />
            </View>
          )}

          <Text style={styles.description}>{item.description}</Text>

          {!isAdmin && (
            <>
              <View style={styles.divider} />
              <AvailabilityCalendar 
                markedDates={markedDates}
                onDateSelect={handleDateSelect}
                startDate={startDate}
                endDate={endDate}
              />
              
              {startDate && endDate && (
                <View style={styles.summaryContainer}>
                  <Text style={styles.summaryTitle}>Rental Summary</Text>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Duration</Text>
                    <Text style={styles.summaryVal}>{days} days</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Deposit (Refundable)</Text>
                    <Text style={styles.summaryVal}>${item.securityDeposit.toFixed(2)}</Text>
                  </View>
                  <View style={[styles.summaryRow, { borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.sm, marginTop: Spacing.sm }]}>
                    <Text style={[styles.summaryLabel, { fontWeight: 'bold' }]}>Total</Text>
                    <Text style={[styles.summaryVal, { fontWeight: 'bold', color: Colors.accent }]}>${total.toFixed(2)}</Text>
                  </View>
                </View>
              )}
            </>
          )}

          {isAdmin && (
            <View style={styles.adminNotes}>
              <Text style={globalStyles.label}>Owner Notes (Hidden from customers)</Text>
              <Text style={{ color: Colors.textSecondary, fontStyle: 'italic' }}>
                {item.ownerNotes || 'No internal notes for this item.'}
              </Text>
            </View>
          )}

          <View style={styles.divider} />
          <ReviewSection itemId={item.id} />
        </View>
      </ScrollView>

      {/* Floating Bottom Bar */}
      <View style={styles.bottomBar}>
        {isAdmin ? (
          <View style={styles.adminActions}>
            <PrimaryButton 
              title="Edit Item" 
              icon="edit"
              onPress={() => router.push(`/item/edit/${item.id}`)} 
              style={{ flex: 1, marginRight: Spacing.md }} 
            />
            <PrimaryButton 
              title="Delete Garment" 
              variant="ghost" 
              icon="trash-2"
              onPress={handleDelete} 
              style={{ width: 140, backgroundColor: Colors.error }} 
            />
          </View>
        ) : (
          <View style={styles.customerActions}>
            <PrimaryButton 
              title={wishlisted ? "Saved" : "Save"} 
              variant={wishlisted ? "filled" : "outlined"}
              icon="heart"
              onPress={() => toggleWishlist(item)}
              style={[{ width: '35%', marginRight: Spacing.md }, wishlisted && { backgroundColor: Colors.surfaceHighlight }]}
            />
            <PrimaryButton 
              title={startDate && endDate ? "Book Request" : "Select Dates"} 
              disabled={!startDate || !endDate || calendarLoading}
              loading={requestLoading}
              onPress={handleBook}
              style={{ flex: 1 }}
            />
          </View>
        )}
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
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: Typography.2xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  category: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: Typography.2xl,
    fontWeight: Typography.bold,
    color: Colors.accent,
  },
  perDay: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
  },
  description: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginTop: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.xl,
  },
  summaryContainer: {
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.md,
    borderRadius: Spacing.radiusMd,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryTitle: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  summaryLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
  },
  summaryVal: {
    color: Colors.textPrimary,
    fontSize: Typography.sm,
  },
  adminNotes: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: Spacing.radiusMd,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surfaceElevated,
    padding: Spacing.screenPadding,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 34,
  },
  customerActions: {
    flexDirection: 'row',
    flex: 1,
  },
  adminActions: {
    flexDirection: 'row',
    flex: 1,
  }
});
