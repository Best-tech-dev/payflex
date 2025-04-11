import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { styled } from 'nativewind';
import { colors } from '@/constants/theme';

const StyledView = styled(View);
const StyledTextInput = styled(TextInput);

interface OTPInputProps {
  length: number;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  autoFocus?: boolean;
}

export function OTPInput({ 
  length, 
  value, 
  onChangeText, 
  error,
  secureTextEntry = false,
  autoFocus = false
}: OTPInputProps) {
  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = (text: string, index: number) => {
    const newValue = value.split('');
    newValue[index] = text;
    const combinedValue = newValue.join('');
    onChangeText(combinedValue);

    // Move to next input if value entered
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <StyledView className="flex-row justify-center space-x-4">
      {Array(length).fill(0).map((_, index) => (
        <StyledTextInput
          key={index}
          ref={(ref) => {
            if (ref) inputRefs.current[index] = ref;
          }}
          className={`w-14 h-14 text-2xl text-center rounded-lg border ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={1}
          keyboardType="number-pad"
          value={value[index] || ''}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          secureTextEntry={secureTextEntry}
          style={styles.input}
        />
      ))}
    </StyledView>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.background.paper,
  },
}); 