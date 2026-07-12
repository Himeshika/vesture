import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import { ClothingItem } from '@/types';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import StatusBadge from './StatusBadge';
import { useRouter } from 'expo-router';

interface ItemCardProps {
  item: ClothingItem;
  isAdmin?: boolean;
  onPress?: () => void;
  onWishlistPress?: () => void;
  isWishlisted?: boolean;
}

export default function ItemCard({ 
  item, 
  isAdmin = false,
  onPress,
  onWishlistPress,
  isWishlisted = false
}: ItemCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(isAdmin ? `/(admin)/item/${item.id}` : `/(customer)/item/${item.id}`);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.images[0] }} 
          style={styles.image} 
          contentFit="cover"
          transition={200}
        />
        
        {!isAdmin && onWishlistPress && (
          <TouchableOpacity 
            style={styles.wishlistButton} 
            onPress={onWishlistPress}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Feather 
              name="heart" 
              size={20} 
              color={isWishlisted ? Colors.error : Colors.background} 
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          {isAdmin && <StatusBadge status={item.status} />}
        </View>

        <Text style={styles.category} numberOfLines={1}>
          {item.category} • Size {item.size}
        </Text>

        <View style={styles.footerRow}>
          <Text style={styles.price}>
            ${item.pricePerDay.toFixed(2)} <Text style={styles.perDay}>/day</Text>
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Spacing.radiusLg,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    position: 'relative',
    backgroundColor: Colors.surfaceHighlight,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  wishlistButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  category: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.accent,
  },
  perDay: {
    fontSize: Typography.sm,
    color: Colors.textMuted,
    fontWeight: Typography.medium,
  },
});
