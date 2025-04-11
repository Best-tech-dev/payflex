import React from 'react';
import { View, Text, StyleSheet, PanResponder, Animated } from 'react-native';
import { colors } from '@/constants/theme';

interface SliderProps {
  value: number;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  onValueChange: (value: number) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
  onValueChange,
  label,
  disabled = false,
  className = '',
}) => {
  const [sliderWidth, setSliderWidth] = React.useState(0);
  const position = React.useRef(new Animated.Value(0)).current;
  
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !disabled,
      onMoveShouldSetPanResponder: () => !disabled,
      onPanResponderGrant: () => {
        position.setOffset(position._value);
      },
      onPanResponderMove: (_, gestureState) => {
        const newPosition = Math.max(0, Math.min(sliderWidth, position._offset + gestureState.dx));
        const newValue = minimumValue + ((newPosition / sliderWidth) * (maximumValue - minimumValue));
        const steppedValue = Math.round(newValue / step) * step;
        onValueChange(steppedValue);
        position.setValue(newPosition - position._offset);
      },
      onPanResponderRelease: () => {
        position.flattenOffset();
      },
    })
  ).current;

  React.useEffect(() => {
    const percentage = (value - minimumValue) / (maximumValue - minimumValue);
    position.setValue(percentage * sliderWidth);
  }, [value, minimumValue, maximumValue, sliderWidth]);

  return (
    <View style={[styles.container, className]}>
      {label && <Text style={[styles.label, disabled && styles.disabledText]}>{label}</Text>}
      <View
        style={[styles.track, disabled && styles.trackDisabled]}
        onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
      >
        <Animated.View
          style={[
            styles.fill,
            disabled && styles.fillDisabled,
            { width: position }
          ]}
        />
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.thumb,
            disabled && styles.thumbDisabled,
            { transform: [{ translateX: position }] }
          ]}
        />
      </View>
      <Text style={[styles.value, disabled && styles.disabledText]}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 8,
  },
  disabledText: {
    color: '#9CA3AF',
  },
  track: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    position: 'relative',
  },
  trackDisabled: {
    backgroundColor: '#F3F4F6',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary.main,
    borderRadius: 2,
  },
  fillDisabled: {
    backgroundColor: '#D1D5DB',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    position: 'absolute',
    top: -8,
    left: -10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  thumbDisabled: {
    backgroundColor: '#D1D5DB',
  },
  value: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'right',
  },
}); 