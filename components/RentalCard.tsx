import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Rental } from '@/types';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import StatusBadge from './StatusBadge';
import dayjs from 'dayjs';

interface RentalCardProps {
  rental: Rental;
  onPress: () => void;
  isAdmin?: boolean;
}

export default function RentalCard({ rental, onPress, isAdmin = false }: RentalCardProps) {
  const start = dayjs(rental.startDate).format('MMM D');
  const end = dayjs(rental.endDate).format('MMM D');
  
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image 
        source={{ uri: rental.itemImage }} 
        style={styles.image} 
        contentFit="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.itemName} numberOfLines={1}>{rental.itemName}</Text>
          <StatusBadge status={rental.status} />
        </View>
        
        {isAdmin && (
          <Text style={styles.customerName}>User: {rental.customerName}</Text>
        )}
        
        <Text style={styles.dates}>
          {start} - {end} • {rental.rentalDays} days
        </Text>
        
        <Text style={styles.price}>Total: ${rental.totalAmount.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Spacing.radiusLg,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  image: {
    width: 80,
    height: 100,
    borderRadius: Spacing.radiusMd,
    backgroundColor: Colors.surfaceHighlight,
  },
  content: {
    flex: 1,
    marginLeft: Spacing.md,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemName: {
    flex: 1,
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  customerName: {
    fontSize: Typography.xs,
    color: Colors.primary,
    marginBottom: 4,
  },
  dates: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  price: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: Colors.accent,
  },
});
