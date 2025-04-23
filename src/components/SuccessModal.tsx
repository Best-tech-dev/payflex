import React, { useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Animated, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

interface ButtonProps {
  text: string;
  onPress: () => void;
  style: 'primary' | 'secondary';
}

interface SuccessModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
  buttons?: ButtonProps[];
  loading?: boolean;
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: '#0066FF',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '500',
  },
  primaryButtonText: {
    color: 'white',
  },
  secondaryButtonText: {
    color: '#374151',
  },
});

export function SuccessModal({ 
  visible, 
  title = 'Success', 
  message = 'Operation completed successfully', 
  onClose,
  autoClose = true,
  autoCloseTime = 2000,
  buttons = [],
  loading = false
}: SuccessModalProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      if (autoClose && onClose) {
        const timer = setTimeout(() => {
          onClose();
        }, autoCloseTime);
        
        return () => clearTimeout(timer);
      }
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, autoClose, autoCloseTime, onClose]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
    >
      <Animated.View 
        style={{ opacity: fadeAnim }}
        className="flex-1 items-center justify-center bg-black/50"
      >
        <View className="bg-white p-8 rounded-2xl items-center justify-center shadow-xl w-4/5">
          <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-4">
            <MaterialCommunityIcons name="check" size={32} color={colors.success.main} />
          </View>
          <Text className="text-gray-800 font-bold text-xl mb-2">{title}</Text>
          <Text className="text-gray-600 text-center mb-6">{message}</Text>
          
          {!autoClose && buttons.length > 0 && (
            <View className="flex-row space-x-4 w-full">
              {buttons.map((button, index) => (
                <TouchableOpacity 
                  key={index}
                  onPress={button.onPress}
                  style={[
                    styles.button,
                    button.style === 'primary' ? styles.primaryButton : styles.secondaryButton
                  ]}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={button.style === 'primary' ? 'white' : colors.primary.main} />
                  ) : (
                    <Text style={[
                      styles.buttonText,
                      button.style === 'primary' ? styles.primaryButtonText : styles.secondaryButtonText
                    ]}>
                      {button.text}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
} 