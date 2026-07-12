import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDashboardStats, DashboardStats } from '@/firebase/analyticsService';
import AnalyticsCard from '@/components/AnalyticsCard';
import SimpleBarRow from '@/components/SimpleBarRow';
import LoadingSpinner from '@/components/LoadingSpinner';
import globalStyles from '@/styles/globalStyles';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';

export default function AdminDashboardScreen() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await fetchStats();
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
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
      <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        <View style={styles.header}>
          <Text style={globalStyles.heading1}>Dashboard</Text>
          <Text style={globalStyles.body}>Overview of your business</Text>
        </View>

        <View style={styles.cardGrid}>
          <AnalyticsCard 
            title="Total Revenue" 
            value={`$${stats?.totalRevenue.toFixed(2) || '0.00'}`} 
            icon="dollar-sign" 
            color={Colors.accent} 
          />
          <AnalyticsCard 
            title="Pending Requests" 
            value={stats?.pendingRequestsCount || 0} 
            icon="bell" 
            color="#EAB308" // yellow
          />
          <AnalyticsCard 
            title="Active Rentals" 
            value={stats?.activeRentalsCount || 0} 
            icon="clock" 
            color={Colors.primary} 
          />
          <AnalyticsCard 
            title="Total Items" 
            value={stats?.totalItemsCount || 0} 
            icon="grid" 
            color={Colors.textSecondary} 
          />
        </View>

        {stats && stats.rentalsByCategory.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rentals by Category</Text>
            <View style={styles.sectionCard}>
              {stats.rentalsByCategory.map((cat, i) => {
                const max = Math.max(...stats.rentalsByCategory.map(c => c.count));
                return (
                  <View key={cat.category} style={i > 0 && { marginTop: Spacing.sm }}>
                    <SimpleBarRow 
                      label={cat.category} 
                      value={cat.count} 
                      max={max} 
                      color={Colors.primary} 
                    />
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {stats && stats.itemsByStatus.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Inventory Health</Text>
            <View style={styles.sectionCard}>
              {stats.itemsByStatus.map((stat, i) => {
                const max = stats.totalItemsCount;
                return (
                  <View key={stat.status} style={i > 0 && { marginTop: Spacing.sm }}>
                    <SimpleBarRow 
                      label={stat.status.replace('_', ' ').toUpperCase()} 
                      value={stat.count} 
                      max={max} 
                      color={Colors.accent} 
                    />
                  </View>
                );
              })}
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.screenPadding,
    paddingBottom: Spacing.2xl,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -Spacing.xs,
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  sectionCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Spacing.radiusLg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  }
});
