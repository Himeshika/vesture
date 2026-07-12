import React from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

// This acts as the root entry point (/) before the _layout.tsx
// Auth navigation effect handles redirecting to appropriate role stacks.
export default function IndexScreen() {
  return <LoadingSpinner fullScreen />;
}
