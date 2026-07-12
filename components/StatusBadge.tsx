import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STATUS_COLORS } from '@/types';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  // Normalize and apply a default if it doesn't map directly
  const color = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.pending;
  
  const displayStatus = status.replace('_', ' ');

  return (
    <View style={[styles.container, { backgroundColor: `${color}20` }]}>
      <Text style={[styles.text, { color }]}>
        {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Spacing.radiusSm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: Typography.xs,
    fontWeight: Typography.bold,
  },
});
