import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { Feather } from '@expo/vector-icons';
import globalStyles from '@/styles/globalStyles';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import Spacing from '@/constants/Spacing';
import InputField from '@/components/InputField';
import PrimaryButton from '@/components/PrimaryButton';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    let valid = true;
    let newErrors: Record<string, string> = {};

    if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
      valid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
      valid = false;
    }
    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
      valid = false;
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      await register(email, password, name.trim());
      // auth layout handles redirection
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to create account.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.screen}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: Spacing.screenPadding }}>
        
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: Spacing.xl, alignSelf: 'flex-start' }}>
          <Feather name="arrow-left" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>

        <View style={{ marginBottom: Spacing.xl }}>
          <Text style={globalStyles.heading1}>Create Account</Text>
          <Text style={[globalStyles.body, { marginTop: Spacing.xs }]}>
            Join Vesture and start renting.
          </Text>
        </View>

        <View>
          <InputField 
            label="Full Name"
            placeholder="Jane Doe"
            value={name}
            onChangeText={(text) => { setName(text); setErrors(prev => ({...prev, name: ''})); }}
            error={errors.name}
            placeholderTextColor={Colors.textMuted}
          />
          
          <InputField 
            label="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="example@email.com"
            value={email}
            onChangeText={(text) => { setEmail(text); setErrors(prev => ({...prev, email: ''})); }}
            error={errors.email}
            placeholderTextColor={Colors.textMuted}
          />
          
          <InputField 
            label="Password"
            secureTextEntry
            placeholder="••••••••"
            value={password}
            onChangeText={(text) => { setPassword(text); setErrors(prev => ({...prev, password: ''})); }}
            error={errors.password}
            placeholderTextColor={Colors.textMuted}
          />
          
          <InputField 
            label="Confirm Password"
            secureTextEntry
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={(text) => { setConfirmPassword(text); setErrors(prev => ({...prev, confirmPassword: ''})); }}
            error={errors.confirmPassword}
            placeholderTextColor={Colors.textMuted}
          />

          {errors.form && (
            <Text style={{ color: Colors.error, fontSize: Typography.sm, marginBottom: Spacing.md }}>
              {errors.form}
            </Text>
          )}

          <View style={{ marginTop: Spacing.sm }}>
            <PrimaryButton 
              title="Create Account" 
              onPress={handleRegister} 
              loading={loading}
            />
          </View>
        </View>

        <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginTop: Spacing.xl, paddingBottom: Spacing.md }}>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={globalStyles.row}>
            <Text style={{ color: Colors.textSecondary, fontSize: Typography.base }}>
              Already have an account?{' '}
            </Text>
            <Text style={{ color: Colors.accent, fontSize: Typography.base, fontWeight: Typography.bold }}>
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
