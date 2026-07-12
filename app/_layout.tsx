import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider } from '@/context/AuthContext';
import { ItemsProvider } from '@/context/ItemsContext';
import { RentalsProvider } from '@/context/RentalsContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { useAuth } from '@/hooks/useAuth';
import { StatusBar } from 'expo-status-bar';
import LoadingSpinner from '@/components/LoadingSpinner';
import Colors from '@/constants/Colors';

// This component handles the routing logic once Auth is loaded
function RootNavigationHandler() {
  const { user, role, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user) {
      if (!inAuthGroup) {
        // Not logged in and not in auth screens, redirect to login
        router.replace('/(auth)/login');
      }
    } else if (user) {
      // User is logged in
      if (inAuthGroup) {
        // From auth screen, redirect based on role
        if (role === 'admin') {
          router.replace('/(admin)');
        } else {
          router.replace('/(customer)');
        }
      } else if (segments[0] !== '(admin)' && role === 'admin') {
        router.replace('/(admin)');
      } else if (segments[0] !== '(customer)' && role === 'customer') {
        router.replace('/(customer)');
      }
    }
  }, [user, role, isLoading, segments, router]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(customer)" options={{ headerShown: false }} />
      <Stack.Screen name="(admin)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
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
  );
}
