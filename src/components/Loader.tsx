import React from 'react';
import { View, Text, Modal, ActivityIndicator, Animated } from 'react-native';
import { colors } from '@/constants/theme';

interface LoaderProps {
  visible: boolean;
  message?: string;
}

export function Loader({ visible, message = 'Loading...' }: LoaderProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

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
        <View className="bg-white p-8 rounded-2xl items-center justify-center shadow-xl">
          <ActivityIndicator 
            size="large" 
            color={colors.primary.main}
            className="mb-4"
          />
          <Text className="text-gray-700 font-medium text-lg">{message}</Text>
        </View>
      </Animated.View>
    </Modal>
  );
} 