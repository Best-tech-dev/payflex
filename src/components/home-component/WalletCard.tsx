import React from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

export interface WalletCardProps {
  balance: string;
  income: string;
  expenses: string;
  loading?: boolean;
  error?: string | null;
  onPress: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({ 
  balance, 
  income, 
  expenses, 
  loading = false,
  error = null,
  onPress 
}) => {
  // Helper function to check if a value is valid
  const isValidValue = (value: string) => {
    return value && value !== '0' && value !== 'undefined' && value !== 'null';
  };

  // Render loading state
  if (loading) {
    return (
      <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
        <View style={{ 
          backgroundColor: colors.primary.main, 
          borderRadius: 24, 
          padding: 24,
          alignItems: 'center',
          justifyContent: 'center',
          height: 160,
          shadowColor: '#000', 
          shadowOffset: { width: 0, height: 1 }, 
          shadowOpacity: 0.1, 
          shadowRadius: 2 
        }}>
          <ActivityIndicator size="large" color="white" />
          <Text style={{ color: 'white', marginTop: 8 }}>Fetching balance...</Text>
        </View>
      </View>
    );
  }

  // Render error state
  if (error) {
    return (
      <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
        <TouchableOpacity 
          onPress={onPress}
          style={{ 
            backgroundColor: colors.primary.main, 
            borderRadius: 24, 
            padding: 24,
            alignItems: 'center',
            justifyContent: 'center',
            height: 160,
            shadowColor: '#000', 
            shadowOffset: { width: 0, height: 1 }, 
            shadowOpacity: 0.1, 
            shadowRadius: 2 
          }}
        >
          <MaterialCommunityIcons name="refresh" size={32} color="white" />
          <Text style={{ color: 'white', marginTop: 8, textAlign: 'center' }}>
            Unable to load wallet data
          </Text>
          <Text style={{ color: 'white', fontSize: 12, marginTop: 4, textAlign: 'center' }}>
            Tap to retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
      <View style={{ 
        backgroundColor: colors.primary.main, 
        borderRadius: 24, 
        padding: 24, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 1 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 2 
      }}>
        <Text style={{ color: 'white', fontSize: 14, marginBottom: 4 }}>Overall Wallet Balance: </Text>
        
        {isValidValue(balance) ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text className='text-xl mb-2 text-white'>#</Text>
            <Text style={{ fontWeight: '600', color: 'white', marginBottom: 16 }} className='text-3xl'>
              {balance}
            </Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <MaterialCommunityIcons name="wallet-outline" size={36} color="white" />
            <Text style={{ fontSize: 18, color: 'white', marginLeft: 8 }}>Not available</Text>
          </View>
        )}
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: 'white', fontSize: 14 }}>Income/m</Text>
            {isValidValue(income) ? (
              <Text style={{ color: 'white', fontWeight: '600' }}>#{income}</Text>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="arrow-down" size={16} color="white" />
                <Text style={{ color: 'white', marginLeft: 4 }}>--</Text>
              </View>
            )}
          </View>
          
          <View>
            <Text style={{ color: 'white', fontSize: 14 }}>Expenses/m</Text>
            {isValidValue(expenses) ? (
              <Text style={{ color: 'white', fontWeight: '600' }}>#{expenses}</Text>
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="arrow-up" size={16} color="white" />
                <Text style={{ color: 'white', marginLeft: 4 }}>--</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default WalletCard;