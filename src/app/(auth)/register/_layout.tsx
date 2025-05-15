// File: src/app/(auth)/register/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RegisterProvider } from '@/contexts/RegisterContexts';
import { TouchableOpacity, View, Text } from 'react-native';
import { router, usePathname } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RegisterLayout() {
  const pathname = usePathname();
  
  // Function to handle back navigation based on current step
  const handleBack = () => {
    const currentStep = pathname.split('/').pop();
    
    if (currentStep === 'Step1' || !currentStep) {
      // If on first step, go back to login
      router.replace('/(auth)/login');
    } else if (currentStep === 'Step2') {
      router.replace('/(auth)/register/Step1');
    } else if (currentStep === 'Step3') {
      router.replace('/(auth)/register/Step2');
    } else if (currentStep === 'Step4') {
      router.replace('/(auth)/register/Step3');
    }
  };

  return (
    <RegisterProvider>
      <SafeAreaView className="flex-1 bg-white">
        {/* Custom Header with Back Button */}
        <View className="flex-row items-center p-4 border-b border-gray-200">
          <TouchableOpacity onPress={handleBack} style={{padding: 2}}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-bold ml-2">Create Account</Text>
        </View>
        
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </SafeAreaView>
    </RegisterProvider>
  );
}
