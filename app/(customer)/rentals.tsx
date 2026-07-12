import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RentalsContext } from '@/context/RentalsContext';
import RentalCard from '@/components/RentalCard';
import EmptyState from '@/components/EmptyState';
import globalStyles from '@/styles/globalStyles';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import { useRouter } from 'expo-router';

export default function CustomerRentalsScreen() {
  const { myRentals, isLoading, fetchMyRentals } = useContext(RentalsContext)!;
  const router = useRouter();

  return (
    <SafeAreaView style={globalStyles.screen} edges={['top']}>
      <View style={styles.header}>
        <Text style={globalStyles.heading1}>My Rentals</Text>
      </View>

      <FlatList
        data={myRentals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RentalCard 
            rental={item} 
            onPress={() => router.push(`/(customer)/rental/${item.id}`)} 
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchMyRentals} tintColor={Colors.primary} />
        }
        ListEmptyComponent={
          <EmptyState 
            icon="clock" 
            message="You have no rental history yet."
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
  },
});
