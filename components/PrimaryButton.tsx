import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'outlined' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  style?: StyleProp<ViewStyle>;
}

export default function PrimaryButton({
  title,
  onPress,
  variant = 'filled',
  loading = false,
  disabled = false,
  icon,
  style,
}: PrimaryButtonProps) {
  const isFilled = variant === 'filled';
  const isOutlined = variant === 'outlined';
  const isGhost = variant === 'ghost';
  
  const isDisabled = disabled || loading;

  const getBackgroundColor = () => {
    if (isFilled) return isDisabled ? Colors.accentMuted : Colors.accent;
    return 'transparent';
  };

  const getBorderColor = () => {
    if (isOutlined) return isDisabled ? Colors.border : Colors.accent;
    return 'transparent';
  };

  const getTextColor = () => {
    if (isFilled) return isDisabled ? Colors.textMuted : '#FFFFFF';
    if (isDisabled) return Colors.textMuted;
    
    // Check if the style includes error color for Ghost error buttons (like Delete)
    if (isGhost && (style as any)?.color === Colors.error) {
       return Colors.error;
    }
    
    if (isGhost && title.includes('Delete')) {
      return Colors.error;
    }

    return Colors.accent;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: isOutlined ? 1 : 0,
        },
        style,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <>
          {icon && (
            <Feather 
              name={icon} 
              size={18} 
              color={getTextColor()} 
              style={styles.icon} 
            />
          )}
          <Text style={[styles.text, { color: getTextColor() }]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 52,
    borderRadius: Spacing.radiusMd,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  text: {
    fontSize: Typography.md,
    fontWeight: Typography.bold,
  },
  icon: {
    marginRight: Spacing.sm,
  },
});
