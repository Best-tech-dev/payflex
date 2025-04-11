import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { colors } from '@/constants/theme';

interface ScreenLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const ScreenLayout = ({
  children,
  className = '',
}: ScreenLayoutProps) => {
  return (
    <SafeAreaView className="flex-1 bg-background-paper">
      <View className={`flex-1 p-4 ${className}`}>{children}</View>
    </SafeAreaView>
  );
}; 