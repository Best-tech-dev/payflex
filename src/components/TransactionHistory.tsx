import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/theme';

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'successful' | 'pending' | 'failed';
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  maxItems?: number;
  showHeader?: boolean;
  onViewAll?: () => void;
}

export default function TransactionHistory({ 
  transactions, 
  maxItems = 3, 
  showHeader = true,
  onViewAll 
}: TransactionHistoryProps) {
  const displayedTransactions = maxItems ? transactions.slice(0, maxItems) : transactions;

  return (
    <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
      {showHeader && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>Recent Transactions</Text>
          {onViewAll && (
            <TouchableOpacity onPress={onViewAll}>
              <Text style={{ color: colors.primary.main, fontSize: 14 }}>See All</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      <View>
        {displayedTransactions.map((transaction) => (
          <View 
            key={transaction.id}
            style={{ 
              backgroundColor: 'white', 
              padding: 16, 
              borderRadius: 12, 
              marginBottom: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827', marginBottom: 4 }}>
                  {transaction.description}
                </Text>
                <Text style={{ fontSize: 12, color: '#6B7280' }}>{transaction.date}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ 
                  fontSize: 16, 
                  fontWeight: '600', 
                  color: transaction.type === 'credit' ? '#10B981' : '#EF4444',
                  marginBottom: 4
                }}>
                  {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </Text>
                <Text style={{ 
                  fontSize: 12, 
                  color: transaction.status === 'successful' ? '#10B981' : 
                         transaction.status === 'pending' ? '#F59E0B' : '#EF4444'
                }}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
} 