import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { getRentalById, requestReturn, approveRental, completeReturnInspection } from '@/firebase/rentalsService';
import { Rental } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import StatusBadge from '@/components/StatusBadge';
import PrimaryButton from '@/components/PrimaryButton';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import dayjs from 'dayjs';

export default function RentalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { role } = useAuth();
  
  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
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
    if (id) {
      fetchRental();
    }
  }, [id]);

  const isAdmin = role === 'admin';

  const handleCustomerRequestReturn = async () => {
    setActionLoading(true);
    try {
      await requestReturn(id as string);
      Alert.alert('Return Requested', 'Please return the item. Waiting for admin inspection.');
      await fetchRental();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdminApprove = async () => {
    setActionLoading(true);
    try {
      await approveRental(id as string, rental!.itemId);
      Alert.alert('Approved', 'Rental has been approved.');
      await fetchRental();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAdminComplete = async () => {
    setActionLoading(true);
    try {
      await completeReturnInspection(id as string, rental!.itemId, rental!.securityDeposit, {
        actualReturnDate: dayjs().toISOString(),
        damageReported: false,
        damageNotes: null,
        damageFee: 0,
        lateFee: 0
      });
      Alert.alert('Completed', 'Return inspection passed successfully.');
      await fetchRental();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!rental) return <EmptyState message="Rental not found" />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={[]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Image source={{ uri: rental.itemImage }} style={styles.image} contentFit="cover" />
          <View style={styles.headerInfo}>
            <Text style={styles.itemName}>{rental.itemName}</Text>
            <StatusBadge status={rental.status} />
          </View>
          
          <View style={styles.detailsBlock}>
            <View style={styles.row}>
              <Text style={styles.label}>Dates</Text>
              <Text style={styles.value}>
                {dayjs(rental.startDate).format('MMM D')} - {dayjs(rental.endDate).format('MMM D, YYYY')}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Duration</Text>
              <Text style={styles.value}>{rental.rentalDays} Days</Text>
            </View>
            
            {isAdmin && (
              <View style={styles.row}>
                <Text style={styles.label}>Customer</Text>
                <Text style={styles.value}>{rental.customerName}</Text>
              </View>
            )}

            <View style={[styles.row, styles.divider]} />
            
            <View style={styles.row}>
              <Text style={styles.label}>Rental Fee</Text>
              <Text style={styles.value}>${rental.rentalPrice.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Deposit</Text>
              <Text style={styles.value}>${rental.securityDeposit.toFixed(2)}</Text>
            </View>
            {rental.depositRefundAmount !== null && (
              <View style={styles.row}>
                <Text style={styles.label}>Refunded amount</Text>
                <Text style={styles.value}>${rental.depositRefundAmount.toFixed(2)}</Text>
              </View>
            )}
            <View style={[styles.row, { marginTop: Spacing.sm }]}>
              <Text style={[styles.label, { fontWeight: 'bold' }]}>Total Paid</Text>
              <Text style={styles.totalValue}>${rental.totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Action Bottom Section */}
        <View style={styles.actionContainer}>
          {!isAdmin && rental.status === 'active' && (
            <PrimaryButton 
              title="Request Return" 
              loading={actionLoading} 
              onPress={handleCustomerRequestReturn} 
            />
          )}

          {isAdmin && rental.status === 'pending' && (
            <PrimaryButton 
              title="Approve Rental" 
              loading={actionLoading} 
              onPress={handleAdminApprove} 
            />
          )}

          {isAdmin && rental.status === 'return_requested' && (
            <PrimaryButton 
              title="Pass Inspection & Complete" 
              loading={actionLoading} 
              onPress={handleAdminComplete} 
            />
          )}

          {rental.status === 'completed' && !rental.reviewed && !isAdmin && (
             <PrimaryButton 
                title="Leave Review (Coming Soon)" 
                disabled 
                onPress={() => {}} 
             />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.screenPadding,
  },
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Spacing.radiusLg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: '100%',
    height: 250,
  },
  headerInfo: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemName: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  detailsBlock: {
    padding: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  label: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
  value: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
  },
  totalValue: {
    fontSize: Typography.lg,
    color: Colors.accent,
    fontWeight: Typography.bold,
  },
  actionContainer: {
    marginTop: Spacing.xl,
  }
});
