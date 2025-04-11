import React, { useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

interface SuccessModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
  buttonText?: string;
  onButtonPress?: () => void;
  loading?: boolean;
}

export function SuccessModal({ 
  visible, 
  title = 'Success', 
  message = 'Operation completed successfully', 
  onClose,
  autoClose = true,
  autoCloseTime = 2000,
  buttonText = 'Close',
  onButtonPress,
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
          
          {!autoClose && (
            <TouchableOpacity 
              onPress={onButtonPress || onClose}
              className="bg-primary-main py-3 px-6 rounded-lg"
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-medium">{buttonText}</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
} 