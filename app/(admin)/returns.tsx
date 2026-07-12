import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getReturnQueue } from '@/firebase/rentalsService';
import { Rental } from '@/types';
import RentalCard from '@/components/RentalCard';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';
import globalStyles from '@/styles/globalStyles';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';

export default function AdminReturnsScreen() {
  const [returnQueue, setReturnQueue] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchReturns = async () => {
    try {
      const data = await getReturnQueue();
      setReturnQueue(data);
    } catch (error) {
      console.error('Failed to fetch returns', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await fetchReturns();
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReturns();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading && !refreshing) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <SafeAreaView style={globalStyles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={globalStyles.heading1}>Return Queue</Text>
        <Text style={globalStyles.body}>Inspect items waiting for return</Text>
      </View>

      <FlatList
        data={returnQueue}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <RentalCard 
            rental={item} 
            isAdmin 
            onPress={() => router.push(`/(admin)/inspection/${item.id}` as any)} 
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        ListEmptyComponent={
          <EmptyState 
            icon="package" 
            message="No items waiting for return inspection." 
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
    paddingHorizontal: Spacing.screenPadding,
    paddingBottom: Spacing.xl,
  }
});
