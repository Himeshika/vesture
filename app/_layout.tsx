import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import { ItemsProvider } from '@/context/ItemsContext';
import { RentalsProvider } from '@/context/RentalsContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { useAuth } from '@/hooks/useAuth';
import { StatusBar } from 'expo-status-bar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Colors from '@/constants/Colors';

// This component handles the routing logic once Auth is loaded
function RootNavigationHandler() {
  const { user, role, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    console.log('[Nav] isLoading:', isLoading, '| user:', user?.email ?? 'none', '| role:', role, '| segment:', segments[0]);

    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inCustomerGroup = segments[0] === '(customer)';
    const inAdminGroup = segments[0] === '(admin)';

    if (!user) {
      if (!inAuthGroup) {
        console.log('[Nav] No user → redirecting to login');
        router.replace('/(auth)/login');
      }
    } else {
      // User is logged in
      if (inAuthGroup) {
        if (role === 'admin') {
          console.log('[Nav] Admin user on auth screen → redirecting to admin');
          router.replace('/(admin)');
        } else {
          console.log('[Nav] Customer user on auth screen → redirecting to customer');
          router.replace('/(customer)');
        }
      } else if (!inAdminGroup && role === 'admin') {
        console.log('[Nav] Admin user not in admin group → redirecting to admin');
        router.replace('/(admin)');
      } else if (!inCustomerGroup && !inAdminGroup) {
        // On index or unknown route — push to customer by default
        console.log('[Nav] User on unknown route → redirecting to customer');
        router.replace('/(customer)');
      }
    }
  }, [user, role, isLoading, segments, router]);

  if (isLoading) {
    console.log('[Nav] Auth loading...');
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(customer)" options={{ headerShown: false }} />
      <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ItemsProvider>
          <RentalsProvider>
            <WishlistProvider>
              <StatusBar style="light" />
              <RootNavigationHandler />
            </WishlistProvider>
          </RentalsProvider>
        </ItemsProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
