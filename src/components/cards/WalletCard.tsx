import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '@/constants/theme';

interface WalletCardProps {
  currency: string;
  balance: number;
  isActive: boolean;
  className?: string;
}

export const WalletCard = ({
  currency,
  balance,
  isActive,
  className = '',
}: WalletCardProps) => {
  return (
    <View
      className={`
        bg-white
        rounded-xl
        p-4
        shadow-sm
        ${!isActive ? 'opacity-50' : ''}
        ${className}
      `}
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-text-primary">{currency}</Text>
        <Text className="text-sm text-text-secondary">
          {isActive ? 'Active' : 'Inactive'}
        </Text>
      </View>
      <Text className="text-2xl font-bold text-primary-main">
        {balance.toLocaleString(undefined, {
          style: 'currency',
          currency: currency,
        })}
      </Text>
    </View>
  );
}; 