import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ItemsContext } from '@/context/ItemsContext';
import { WishlistContext } from '@/context/WishlistContext';
import { ClothingItem } from '@/types';
import ItemCard from '@/components/ItemCard';
import CategoryPill from '@/components/CategoryPill';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { CATEGORIES, CATEGORY_ICONS, ALL_CATEGORY_NAME } from '@/constants/Categories';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import globalStyles from '@/styles/globalStyles';

export default function CustomerFeedScreen() {
  const { items, isLoading, isRefreshing, refreshItems } = useContext(ItemsContext)!;
  const { isWishlisted, toggleWishlist } = useContext(WishlistContext)!;
  
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORY_NAME);
  const [filteredItems, setFilteredItems] = useState<ClothingItem[]>([]);

  useEffect(() => {
    if (selectedCategory === ALL_CATEGORY_NAME) {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => item.category === selectedCategory));
    }
  }, [items, selectedCategory]);

  const categories = [ALL_CATEGORY_NAME, ...CATEGORIES];

  if (isLoading && !isRefreshing) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <SafeAreaView style={globalStyles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={globalStyles.heading1}>Discover</Text>
        <Text style={globalStyles.body}>Find your perfect look</Text>
      </View>

      <View style={styles.categoriesWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((cat) => (
            <CategoryPill
              key={cat}
              label={cat}
              icon={cat === ALL_CATEGORY_NAME ? 'grid' : CATEGORY_ICONS[cat]}
              selected={selectedCategory === cat}
              onPress={() => setSelectedCategory(cat)}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredItems}
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
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refreshItems} tintColor={Colors.primary} />
        }
        ListEmptyComponent={
          <EmptyState 
            icon="search" 
            message={`No items found${selectedCategory !== ALL_CATEGORY_NAME ? ` in ${selectedCategory}` : ''}.`}
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
  categoriesWrapper: {
    marginBottom: Spacing.md,
  },
  categoriesContent: {
    paddingHorizontal: Spacing.screenPadding,
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
