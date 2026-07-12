import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet } from 'react-native';
import globalStyles from '@/styles/globalStyles';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function InputField({ label, error, style, ...props }: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={globalStyles.label}>{label}</Text>
      <TextInput
        style={[
          globalStyles.input,
          isFocused && globalStyles.inputFocused,
          error ? globalStyles.inputError : undefined,
          style,
        ]}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        placeholderTextColor={Colors.textMuted}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 0,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.sm,
    marginTop: -8,
    marginBottom: 16,
  },
});
