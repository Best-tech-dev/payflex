import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '@/constants/theme';

interface SwitchProps {
  label?: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  const translateX = React.useRef(new Animated.Value(value ? 24 : 0)).current;
  
  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: value ? 24 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value, translateX]);
  
  return (
    <View style={[styles.container, className]}>
      {label && <Text style={[styles.label, disabled && styles.disabledText]}>{label}</Text>}
      <TouchableOpacity
        style={[
          styles.track,
          value && styles.trackActive,
          disabled && styles.trackDisabled
        ]}
        onPress={() => !disabled && onChange(!value)}
        disabled={disabled}
      >
        <Animated.View
          style={[
            styles.thumb,
            value && styles.thumbActive,
            disabled && styles.thumbDisabled,
            { transform: [{ translateX }] }
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#111827',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  track: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    padding: 2,
  },
  trackActive: {
    backgroundColor: colors.primary.main,
  },
  trackDisabled: {
    backgroundColor: '#F3F4F6',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  thumbActive: {
    backgroundColor: 'white',
  },
  thumbDisabled: {
    backgroundColor: '#D1D5DB',
  },
}); 