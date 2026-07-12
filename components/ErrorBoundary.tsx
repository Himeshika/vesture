import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import Spacing from '@/constants/Spacing';
import Typography from '@/constants/Typography';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: string;
  stack: string;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: '', stack: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    console.error('[ErrorBoundary] Caught error:', error.message);
    console.error('[ErrorBoundary] Stack:', error.stack);
    return {
      hasError: true,
      error: error.message,
      stack: error.stack ?? '',
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] componentDidCatch:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>🚨 App Crashed</Text>
          <Text style={styles.errorText}>{this.state.error}</Text>
          <ScrollView style={styles.stack}>
            <Text style={styles.stackText}>{this.state.stack}</Text>
          </ScrollView>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.setState({ hasError: false, error: '', stack: '' })}
          >
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.screenPadding,
    paddingTop: Spacing.xxxl,
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: Colors.error,
    marginBottom: Spacing.md,
  },
  errorText: {
    fontSize: Typography.base,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  stack: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Spacing.radiusSm,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  stackText: {
    fontSize: Typography.xs,
    color: Colors.textMuted,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: Colors.accent,
    padding: Spacing.md,
    borderRadius: Spacing.radiusSm,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.textPrimary,
    fontWeight: Typography.bold,
  },
});
