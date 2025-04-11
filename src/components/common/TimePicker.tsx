import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

interface TimePickerProps {
  label?: string;
  value?: Date;
  onChange: (date: Date) => void;
  disabled?: boolean;
  className?: string;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  return (
    <View style={[styles.container, className]}>
      {label && <Text style={[styles.label, disabled && styles.disabledText]}>{label}</Text>}
      <TouchableOpacity
        style={[
          styles.picker,
          disabled && styles.pickerDisabled
        ]}
        disabled={disabled}
      >
        <Text style={[
          styles.value,
          disabled && styles.disabledText
        ]}>
          {value ? value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Select time'}
        </Text>
        <MaterialCommunityIcons name="clock-outline" size={20} color={disabled ? '#9CA3AF' : '#6B7280'} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
  },
  pickerDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  value: {
    fontSize: 16,
    color: '#111827',
  },
  disabledText: {
    color: '#9CA3AF',
  },
}); 