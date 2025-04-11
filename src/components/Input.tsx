import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TextInputProps,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '@/constants/theme';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
}

export const Input = ({
  label,
  error,
  secureTextEntry,
  onChangeText,
  value,
  ...props
}: InputProps) => {
  const [isSecureEntry, setIsSecureEntry] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-1">{label}</Text>
      <View
        className={`flex-row items-center border rounded-lg px-4 py-3 bg-white
          ${error ? 'border-red-500' : isFocused ? 'border-primary' : 'border-gray-300'}`}
      >
        <TextInput
          className="flex-1 text-base text-gray-900"
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isSecureEntry}
          onChangeText={onChangeText}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsSecureEntry(!isSecureEntry)}
            className="ml-2"
          >
            <Text className="text-primary text-sm">
              {isSecureEntry ? 'Show' : 'Hide'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-sm text-red-500 mt-1">{error}</Text>
      )}
    </View>
  );
}; 