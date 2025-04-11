import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '@/constants/theme';

interface WalletCardProps {
  balance: string;
  income: string;
  expenses: string;
}

const WalletCard: React.FC<WalletCardProps> = ({ balance, income, expenses }) => {
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
        <Text style={{ fontSize: 36, fontWeight: 'semibold', color: 'white', marginBottom: 16 }}>
          #{balance}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ color: 'white', fontSize: 14 }}>Income</Text>
            <Text style={{ color: 'white', fontWeight: '600' }}>+#{income}</Text>
          </View>
          <View>
            <Text style={{ color: 'white', fontSize: 14 }}>Expenses</Text>
            <Text style={{ color: 'white', fontWeight: '600' }}>-#{expenses}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WalletCard;