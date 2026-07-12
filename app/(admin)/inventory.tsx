import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { ItemsContext } from '@/context/ItemsContext';
import ItemCard from '@/components/ItemCard';
import InputField from '@/components/InputField';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import globalStyles from '@/styles/globalStyles';

export default function AdminInventoryScreen() {
  const { items, refreshItems, isRefreshing } = useContext(ItemsContext)!;
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={globalStyles.screen} edges={['top']}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={globalStyles.heading1}>Inventory</Text>
          <TouchableOpacity 
            style={styles.addButton} 
            onPress={() => router.push('/(admin)/add-item' as any)}
          >
            <Feather name="plus" size={20} color={Colors.background} />
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchWrapper}>
          <Feather name="search" size={20} color={Colors.textMuted} style={styles.searchIcon} />
          <InputField
            label=""
            placeholder="Search items..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <ItemCard item={item} isAdmin onPress={() => router.push(`/(admin)/item/${item.id}` as any)} />
          </View>
        )}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        onRefresh={refreshItems}
        refreshing={isRefreshing}
        ListEmptyComponent={
          <EmptyState 
            icon="box" 
            message={searchQuery ? "No matching items found." : "Your inventory is empty. Add your first item."}
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
    paddingBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
  },
  addButtonText: {
    color: Colors.background,
    fontWeight: Typography.bold,
    marginLeft: 6,
  },
  searchWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: Spacing.md,
    zIndex: 1,
  },
  searchInput: {
    paddingLeft: 42,
    marginBottom: 0,
    backgroundColor: Colors.surface,
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
