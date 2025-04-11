import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/theme';

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  icon: string;
  status: 'successful' | 'pending' | 'failed';
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  onSeeAllPress: () => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, onSeeAllPress }) => {
  return (
    <View style={{ paddingHorizontal: 24, marginBottom: 2 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>Recent Transactions</Text>
        <TouchableOpacity onPress={onSeeAllPress}>
          <Text style={{ color: colors.primary.main, fontSize: 14, paddingRight: 8}}>See All</Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginBottom: 16 }}>
        {transactions.slice(0, 3).map((transaction) => (
          <View 
            key={transaction.id}
            style={{ 
              backgroundColor: 'white', 
              padding: 8, 
              borderRadius: 12, 
              flexDirection: 'row', 
              alignItems: 'center', 
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: 1 }, 
              shadowOpacity: 0.1, 
              shadowRadius: 2, 
              marginBottom: 8 
            }}
          >
            <View style={{ 
              width: 20, 
              height: 20, 
              backgroundColor: '#F3F4F6', 
              borderRadius: 999, 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginRight: 8 
            }}>
              <Text style={{ fontSize: 12 }}>{transaction.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '500', color: '#111827', fontSize: 12, marginBottom: 4 }}>
                {transaction.description}
              </Text>
              <Text style={{ color: '#6B7280', fontSize: 10 }}>{transaction.date}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text 
                style={{ 
                  fontWeight: '600', 
                  color: transaction.type === 'credit' ? '#10B981' : '#EF4444', 
                  fontSize: 12, 
                  marginBottom: 4 
                }}
              >
                {transaction.type === 'credit' ? '+' : '-'}${transaction.amount}
              </Text>
              <Text 
                style={{ 
                  fontSize: 10, 
                  color: transaction.status === 'successful' ? '#10B981' : 
                         transaction.status === 'pending' ? '#F59E0B' : '#EF4444' 
                }}
              >
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default TransactionHistory;