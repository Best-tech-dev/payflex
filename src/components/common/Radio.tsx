import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

interface RadioProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  className?: string;
}

export const Radio: React.FC<RadioProps> = ({
  label,
  selected,
  onSelect,
  disabled = false,
  className = '',
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, className]}
      onPress={() => !disabled && onSelect()}
      disabled={disabled}
    >
      <View style={[
        styles.radio,
        selected && styles.selected,
        disabled && styles.disabled
      ]}>
        {selected && (
          <View style={styles.innerCircle} />
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
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary.main,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    borderColor: colors.primary.main,
  },
  innerCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary.main,
  },
  disabled: {
    borderColor: '#D1D5DB',
  },
  label: {
    fontSize: 16,
    color: '#111827',
  },
  disabledText: {
    color: '#9CA3AF',
  },
}); 