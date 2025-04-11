import React, { useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { styled } from 'nativewind';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

const StyledView = styled(View);
const StyledText = styled(Text);

interface ToastProps {
  message: string;
  type?: 'error' | 'success';
  visible: boolean;
  onHide: () => void;
}

export function Toast({ message, type = 'error', visible, onHide }: ToastProps) {
  const translateY = new Animated.Value(-100);

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => onHide());
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY }] },
        type === 'error' ? styles.errorContainer : styles.successContainer,
      ]}
    >
      <StyledView className="flex-row items-center px-4 py-3">
        <MaterialCommunityIcons
          name={type === 'error' ? 'alert-circle' : 'check-circle'}
          size={24}
          color={type === 'error' ? colors.error.main : colors.success.main}
        />
        <StyledText
          className={`ml-2 flex-1 ${
            type === 'error' ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {message}
        </StyledText>
      </StyledView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  errorContainer: {
    backgroundColor: colors.error.light,
  },
  successContainer: {
    backgroundColor: colors.success.light,
  },
}); 