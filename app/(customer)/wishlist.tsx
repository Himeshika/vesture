import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WishlistContext } from '@/context/WishlistContext';
import { ItemsContext } from '@/context/ItemsContext';
import ItemCard from '@/components/ItemCard';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import globalStyles from '@/styles/globalStyles';

export default function WishlistScreen() {
  const { wishlist, toggleWishlist, isWishlisted, fetchWishlist, isLoading } = useContext(WishlistContext)!;
  const { getItemById } = useContext(ItemsContext)!;

  // We need the full ClothingItem to render ItemCard properly and to toggle
  // We reconstruct it from cache for rendering.
  const wishlistedFullItems = wishlist.map(entry => getItemById(entry.itemId)).filter(Boolean);

  return (
    <SafeAreaView style={globalStyles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={globalStyles.heading1}>Wishlist</Text>
      </View>

      <FlatList
        data={wishlistedFullItems as any[]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <ItemCard 
              item={item} 
              isWishlisted={isWishlisted(item.id)}
              onWishlistPress={() => toggleWishlist(item)}
            />
          </View>
        )}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        onRefresh={fetchWishlist}
        refreshing={isLoading}
        ListEmptyComponent={
          <EmptyState 
            icon="heart" 
            message="Your wishlist is empty. Save items you love."
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.screenPadding,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  itemWrapper: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    maxWidth: '50%',
  },
});
