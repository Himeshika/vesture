import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import globalStyles from '@/styles/globalStyles';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import InputField from '@/components/InputField';
import PrimaryButton from '@/components/PrimaryButton';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      await login(email, password);
      // App root layout (_layout.tsx) handles redirection based on role
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.screen}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: Spacing.screenPadding }}>
        
        {/* Top Section */}
        <View style={{ flex: 0.4, justifyContent: 'center' }}>
          <Text style={{
            fontSize: Typography.display,
            fontWeight: Typography.extraBold,
            color: Colors.primary,
            letterSpacing: Typography.wide,
            marginBottom: Spacing.xs,
          }}>
            Vesture
          </Text>
          <Text style={{
            fontSize: Typography.lg,
            color: Colors.textSecondary,
          }}>
            Rent the Look. Own the Moment.
          </Text>
        </View>

        {/* Form Section */}
        <View style={{ flex: 0.6, justifyContent: 'flex-start' }}>
          <InputField 
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="example@email.com"
            value={email}
            onChangeText={(text) => { setEmail(text); setError(null); }}
            placeholderTextColor={Colors.textMuted}
          />
          
          <InputField 
            label="Password"
            secureTextEntry
            placeholder="••••••••"
            value={password}
            onChangeText={(text) => { setPassword(text); setError(null); }}
            placeholderTextColor={Colors.textMuted}
          />
          
          {error && (
            <Text style={{ color: Colors.error, fontSize: Typography.sm, marginBottom: Spacing.md }}>
              {error}
            </Text>
          )}

          <TouchableOpacity onPress={() => Alert.alert('Coming Soon', 'Password reset will be available soon.')} style={{ alignSelf: 'flex-end', marginBottom: Spacing.lg }}>
            <Text style={{ color: Colors.accent, fontSize: Typography.base }}>Forgot password?</Text>
          </TouchableOpacity>

          <PrimaryButton 
            title="Sign In" 
            onPress={handleLogin} 
            loading={loading}
          />
        </View>

        {/* Footer */}
        <View style={{ justifyContent: 'flex-end', alignItems: 'center', paddingBottom: Spacing.xl }}>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={globalStyles.row}>
            <Text style={{ color: Colors.textSecondary, fontSize: Typography.base }}>
              Don't have an account?{' '}
            </Text>
            <Text style={{ color: Colors.accent, fontSize: Typography.base, fontWeight: Typography.bold }}>
              Register
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
