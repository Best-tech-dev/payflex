import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

interface BigLoaderProps {
  message: string;
}

const BigLoader: React.FC<BigLoaderProps> = ({ message }) => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-lg font-bold text-gray-800 mb-4 text-center">{message}</Text>
      <ActivityIndicator size="large" color="#3B82F6" />
    </View>
  );
};

export default BigLoader;