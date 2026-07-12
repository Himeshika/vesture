import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';

interface CategoryPillProps {
  label: string;
  icon?: string;
  selected?: boolean;
  onPress: () => void;
}

export default function CategoryPill({ label, icon, selected = false, onPress }: CategoryPillProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        selected && styles.containerSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && (
        <Feather 
          name={icon as keyof typeof Feather.glyphMap} 
          size={16} 
          color={selected ? Colors.background : Colors.primary} 
          style={styles.icon}
        />
      )}
      <Text style={[
        styles.label,
        selected && styles.labelSelected
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  containerSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  icon: {
    marginRight: 6,
  },
  label: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  labelSelected: {
    color: Colors.background,
    fontWeight: Typography.bold,
  },
});
