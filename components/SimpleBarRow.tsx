import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';

interface SimpleBarRowProps {
  label: string;
  value: number;
  max: number;
  color?: string;
}

export default function SimpleBarRow({ label, value, max, color = Colors.accent }: SimpleBarRowProps) {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  
  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <View style={styles.barTrack}>
        <View 
          style={[
            styles.barFill, 
            { width: `${Math.min(100, Math.max(0, percentage))}%`, backgroundColor: color }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
  },
  value: {
    fontSize: Typography.sm,
    fontWeight: Typography.bold,
    color: Colors.textSecondary,
  },
  barTrack: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});
