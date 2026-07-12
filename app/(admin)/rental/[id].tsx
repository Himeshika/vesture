import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { getRentalById, approveRental, rejectRental } from '@/firebase/rentalsService';
import { Rental } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import PrimaryButton from '@/components/PrimaryButton';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import InputField from '@/components/InputField';
import globalStyles from '@/styles/globalStyles';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import dayjs from 'dayjs';

export default function AdminRentalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const fetchRental = async () => {
    try {
      const data = await getRentalById(id as string);
      setRental(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchRental();
  }, [id]);

  const handleApprove = async () => {
    if (!rental) return;
    setActionLoading(true);
    try {
      await approveRental(rental.id, rental.itemId);
      Alert.alert('Approved', 'Rental approved successfully.');
      await fetchRental();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rental || !rejectReason.trim()) {
      Alert.alert('Required', 'Please enter a reason for rejection.');
      return;
    }
    setActionLoading(true);
    try {
      await rejectRental(rental.id, rental.itemId, rejectReason);
      Alert.alert('Rejected', 'Rental request has been rejected.');
      router.back();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!rental) return <EmptyState message="Rental not found" />;

  return (
    <SafeAreaView style={globalStyles.screen} edges={[]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: rental.itemImage }} style={styles.image} contentFit="cover" />

        <View style={styles.section}>
          <View style={styles.headerRow}>
            <Text style={styles.itemName}>{rental.itemName}</Text>
            <StatusBadge status={rental.status} />
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Customer</Text>
            <Text style={styles.value}>{rental.customerName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Rental Period</Text>
            <Text style={styles.value}>
              {dayjs(rental.startDate).format('MMM D')} — {dayjs(rental.endDate).format('MMM D, YYYY')}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.value}>{rental.rentalDays} days</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Category</Text>
            <Text style={styles.value}>{rental.itemCategory}</Text>
          </View>

          <View style={{ height: 1, backgroundColor: Colors.border, marginVertical: Spacing.md }} />

          <View style={styles.detailRow}>
            <Text style={styles.label}>Rental Price</Text>
            <Text style={styles.value}>${rental.rentalPrice.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Security Deposit</Text>
            <Text style={styles.value}>${rental.securityDeposit.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.label, { fontWeight: 'bold' }]}>Total Amount</Text>
            <Text style={[styles.value, { color: Colors.accent, fontWeight: 'bold' }]}>
              ${rental.totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        {rental.status === 'pending' && (
          <View style={styles.actions}>
            {!showRejectForm ? (
              <View style={styles.buttonRow}>
                <PrimaryButton
                  title="Approve"
                  icon="check"
                  onPress={handleApprove}
                  loading={actionLoading}
                  style={{ flex: 1, marginRight: Spacing.sm }}
                />
                <PrimaryButton
                  title="Reject"
                  icon="x"
                  variant="outlined"
                  onPress={() => setShowRejectForm(true)}
                  style={{ flex: 1, marginLeft: Spacing.sm }}
                />
              </View>
            ) : (
              <View>
                <InputField
                  label="Reason for Rejection"
                  value={rejectReason}
                  onChangeText={setRejectReason}
                  multiline
                  numberOfLines={3}
                  style={{ height: 80, textAlignVertical: 'top' }}
                />
                <View style={styles.buttonRow}>
                  <PrimaryButton
                    title="Cancel"
                    variant="ghost"
                    onPress={() => setShowRejectForm(false)}
                    style={{ flex: 1, marginRight: Spacing.sm }}
                  />
                  <PrimaryButton
                    title="Confirm Rejection"
                    onPress={handleReject}
                    loading={actionLoading}
                    style={{ flex: 1, marginLeft: Spacing.sm }}
                  />
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing['2xl'],
  },
  image: {
    width: '100%',
    height: 250,
    backgroundColor: Colors.surfaceHighlight,
  },
  section: {
    padding: Spacing.screenPadding,
    backgroundColor: Colors.surfaceElevated,
    marginHorizontal: Spacing.screenPadding,
    marginTop: Spacing.md,
    borderRadius: Spacing.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  itemName: {
    flex: 1,
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: Typography.base,
  },
  value: {
    color: Colors.textPrimary,
    fontSize: Typography.base,
    fontWeight: Typography.medium,
  },
  actions: {
    padding: Spacing.screenPadding,
    marginTop: Spacing.sm,
  },
  buttonRow: {
    flexDirection: 'row',
  },
});
