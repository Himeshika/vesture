import React, { useState, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ItemsContext } from '@/context/ItemsContext';
import { WishlistContext } from '@/context/WishlistContext';
import ItemCard from '@/components/ItemCard';
import InputField from '@/components/InputField';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import globalStyles from '@/styles/globalStyles';

export default function CustomerSearchScreen() {
  const { items } = useContext(ItemsContext)!;
  const { isWishlisted, toggleWishlist } = useContext(WishlistContext)!;
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    return items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.color?.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  return (
    <SafeAreaView style={globalStyles.screen} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.searchBarContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <Feather name="search" size={20} color={Colors.textMuted} style={styles.searchIcon} />
            <InputField
              label=""
              placeholder="Search items, categories, colors..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              style={styles.input}
              placeholderTextColor={Colors.textMuted}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearIcon}>
                <Feather name="x-circle" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>
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
        ListEmptyComponent={
          searchQuery.trim().length > 0 ? (
            <EmptyState 
              icon="search" 
              message="No results found for your search."
            />
          ) : (
            <View style={styles.initialState}>
              <Feather name="search" size={48} color={Colors.surfaceHighlight} style={{ marginBottom: Spacing.md }} />
              <Text style={styles.initialText}>Search our full collection</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: Spacing.sm,
    marginRight: Spacing.xs,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: Spacing.md,
    zIndex: 1,
  },
  input: {
    flex: 1,
    paddingLeft: 42,
    paddingRight: 40,
    marginBottom: 0,
    backgroundColor: Colors.surface,
  },
  clearIcon: {
    position: 'absolute',
    right: Spacing.md,
    zIndex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.xl,
    flexGrow: 1,
  },
  itemWrapper: {
    flex: 1,
    paddingHorizontal: Spacing.sm,
    maxWidth: '50%',
  },
  initialState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  initialText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
  },
});
