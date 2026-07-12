import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getPendingRequests } from '@/firebase/rentalsService';
import { Rental } from '@/types';
import RentalCard from '@/components/RentalCard';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';
import globalStyles from '@/styles/globalStyles';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';

export default function AdminRequestsScreen() {
  const [requests, setRequests] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const fetchRequests = async () => {
    try {
      const data = await getPendingRequests();
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await fetchRequests();
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRequests();
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
        <Text style={globalStyles.heading1}>Rental Requests</Text>
        <Text style={globalStyles.body}>Review and approve pending requests</Text>
      </View>

      <FlatList
        data={requests}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <RentalCard 
            rental={item} 
            isAdmin 
            onPress={() => router.push(`/(admin)/rental/${item.id}` as any)} 
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        ListEmptyComponent={
          <EmptyState 
            icon="check-circle" 
            message="No pending rental requests. You're all caught up!" 
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
