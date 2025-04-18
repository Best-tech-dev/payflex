import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

interface SelectProps {
  label?: string;
  value?: string;
  placeholder?: string;
  options: { label: string; value: string; disabled?: boolean }[];
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  placeholder = 'Select an option',
  options,
  onChange,
  error,
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);
  
  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <View style={[styles.container, className]}>
      {label && <Text style={[styles.label, disabled && styles.disabledText]}>{label}</Text>}
      <TouchableOpacity
        style={[
          styles.select,
          error ? styles.errorSelect : null,
          disabled && styles.selectDisabled
        ]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Text style={[
          selectedOption ? styles.selectedText : styles.placeholderText,
          disabled && styles.disabledText
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <MaterialCommunityIcons 
          name="chevron-down" 
          size={20} 
          color={disabled ? '#9CA3AF' : '#6B7280'} 
        />
      </TouchableOpacity>
      {error && <Text style={styles.errorText}>{error}</Text>}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <ScrollView style={styles.optionsContainer}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.option,
                    option.value === value && styles.selectedOption,
                    option.disabled && styles.disabledOption
                  ]}
                  onPress={() => !option.disabled && handleSelect(option.value)}
                  disabled={option.disabled}
                >
                  <Text style={[
                    styles.optionText,
                    option.value === value && styles.selectedOptionText,
                    option.disabled && styles.disabledOptionText
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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
  select: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
  },
  errorSelect: {
    borderColor: '#EF4444',
  },
  selectedText: {
    fontSize: 16,
    color: '#111827',
  },
  placeholderText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
  selectDisabled: {
    backgroundColor: '#F3F4F6',
    borderColor: '#D1D5DB',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '80%',
    maxHeight: '60%',
  },
  optionsContainer: {
    maxHeight: '100%',
  },
  option: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  selectedOption: {
    backgroundColor: colors.primary.light,
  },
  disabledOption: {
    backgroundColor: '#F3F4F6',
  },
  optionText: {
    fontSize: 16,
    color: '#111827',
  },
  selectedOptionText: {
    color: colors.primary.main,
    fontWeight: '500',
  },
  disabledOptionText: {
    color: '#9CA3AF',
  },
}); 