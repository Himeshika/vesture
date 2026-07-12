import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { getRentalById, completeReturnInspection } from '@/firebase/rentalsService';
import { Rental } from '@/types';
import PrimaryButton from '@/components/PrimaryButton';
import InputField from '@/components/InputField';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import globalStyles from '@/styles/globalStyles';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import dayjs from 'dayjs';

export default function AdminInspectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [rental, setRental] = useState<Rental | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Inspection form state
  const [hasDamage, setHasDamage] = useState(false);
  const [damageNotes, setDamageNotes] = useState('');
  const [damageFee, setDamageFee] = useState('0');
  const [lateFee, setLateFee] = useState('0');

  useEffect(() => {
    if (id) {
      getRentalById(id as string).then(data => {
        setRental(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleCompleteInspection = async () => {
    if (!rental) return;
    
    if (hasDamage && !damageNotes.trim()) {
      Alert.alert('Damage Notes Required', 'Please describe the damage found.');
      return;
    }

    setActionLoading(true);
    try {
      await completeReturnInspection(
        rental.id,
        rental.itemId,
        rental.securityDeposit,
        {
          actualReturnDate: dayjs().toISOString(),
          damageReported: hasDamage,
          damageNotes: hasDamage ? damageNotes : null,
          damageFee: parseFloat(damageFee) || 0,
          lateFee: parseFloat(lateFee) || 0,
        }
      );

      const refundAmount = Math.max(0, rental.securityDeposit - (parseFloat(damageFee) || 0) - (parseFloat(lateFee) || 0));
      Alert.alert(
        'Inspection Complete',
        `Return processed successfully.\nDeposit Refund: $${refundAmount.toFixed(2)}`,
        [{ text: 'Done', onPress: () => router.replace('/(admin)/returns') }]
      );
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to process inspection.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!rental) return <EmptyState message="Rental not found" />;

  const potentialRefund = Math.max(0, rental.securityDeposit - (parseFloat(damageFee) || 0) - (parseFloat(lateFee) || 0));

  return (
    <SafeAreaView style={globalStyles.screen} edges={[]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Summary */}
        <View style={styles.summaryCard}>
          <Image source={{ uri: rental.itemImage }} style={styles.image} contentFit="cover" />
          <View style={styles.summaryInfo}>
            <Text style={styles.itemName}>{rental.itemName}</Text>
            <Text style={styles.customerName}>Rented by: {rental.customerName}</Text>
            <Text style={styles.period}>
              {dayjs(rental.startDate).format('MMM D')} — {dayjs(rental.endDate).format('MMM D, YYYY')}
            </Text>
          </View>
        </View>

        {/* Inspection Form */}
        <View style={styles.section}>
          <Text style={globalStyles.heading2}>Return Inspection</Text>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Damage Found</Text>
            <Switch
              value={hasDamage}
              onValueChange={setHasDamage}
              trackColor={{ false: Colors.border, true: `${Colors.error}80` }}
              thumbColor={hasDamage ? Colors.error : Colors.textMuted}
            />
          </View>

          {hasDamage && (
            <>
              <InputField
                label="Damage Description *"
                value={damageNotes}
                onChangeText={setDamageNotes}
                multiline
                numberOfLines={3}
                style={{ height: 80, textAlignVertical: 'top' }}
                placeholder="Describe the damage"
              />
              <InputField
                label="Damage Fee ($)"
                value={damageFee}
                onChangeText={setDamageFee}
                keyboardType="numeric"
              />
            </>
          )}

          <InputField
            label="Late Return Fee ($)"
            value={lateFee}
            onChangeText={setLateFee}
            keyboardType="numeric"
          />

          {/* Live Refund Calculation */}
          <View style={styles.refundCard}>
            <View style={styles.refundRow}>
              <Text style={styles.refundLabel}>Security Deposit Held</Text>
              <Text style={styles.refundVal}>${rental.securityDeposit.toFixed(2)}</Text>
            </View>
            <View style={styles.refundRow}>
              <Text style={styles.refundLabel}>Deductions</Text>
              <Text style={{ color: Colors.error }}>
                -${((parseFloat(damageFee) || 0) + (parseFloat(lateFee) || 0)).toFixed(2)}
              </Text>
            </View>
            <View style={[styles.refundRow, styles.totalRow]}>
              <Text style={[styles.refundLabel, { fontWeight: 'bold' }]}>Refund to Customer</Text>
              <Text style={styles.refundTotal}>${potentialRefund.toFixed(2)}</Text>
            </View>
          </View>

          <View style={{ marginTop: Spacing.xl }}>
            <PrimaryButton
              title="Complete Inspection"
              loading={actionLoading}
              onPress={handleCompleteInspection}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing['2xl'],
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: Spacing.screenPadding,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Spacing.radiusLg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: 100,
    height: 120,
    backgroundColor: Colors.surfaceHighlight,
  },
  summaryInfo: {
    flex: 1,
    padding: Spacing.md,
  },
  itemName: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  customerName: {
    fontSize: Typography.sm,
    color: Colors.primary,
    marginBottom: 4,
  },
  period: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  section: {
    padding: Spacing.screenPadding,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  switchLabel: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    fontWeight: Typography.medium,
  },
  refundCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Spacing.radiusMd,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  refundRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
  },
  refundLabel: {
    color: Colors.textSecondary,
    fontSize: Typography.sm,
  },
  refundVal: {
    color: Colors.textPrimary,
    fontSize: Typography.sm,
  },
  refundTotal: {
    color: Colors.accent,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
  },
});
