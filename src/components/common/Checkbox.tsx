import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  className = '',
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, className]}
      onPress={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <View style={[
        styles.checkbox,
        checked && styles.checked,
        disabled && styles.disabled
      ]}>
        {checked && (
          <MaterialCommunityIcons name="check" size={16} color="white" />
        )}
      </View>
      <Text style={[
        styles.label,
        disabled && styles.disabledText
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary.main,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: colors.primary.main,
  },
  disabled: {
    borderColor: '#D1D5DB',
    backgroundColor: '#F3F4F6',
  },
  label: {
    fontSize: 16,
    color: '#111827',
  },
  disabledText: {
    color: '#9CA3AF',
  },
}); 