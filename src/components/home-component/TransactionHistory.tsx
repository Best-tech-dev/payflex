import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  icon: string;
  status: 'success' | 'pending' | 'failed';
  credit_debit: 'credit' | 'debit';
  transaction_type: 'deposit' | 'transfer' | 'airtime' | 'data'
}

interface TransactionHistoryProps {
  transactions: Transaction[] | null;
  onSeeAllPress: () => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onSeeAllPress,
  loading = false,
  error = null,
  onRetry
}) => {
  return (
    <View style={{ paddingHorizontal: 24, marginBottom: 20 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827' }}>Recent Transactions</Text>
        {transactions && transactions.length > 0 && (
          <TouchableOpacity onPress={onSeeAllPress}>
            <Text style={{ color: colors.primary.main, fontSize: 14, paddingRight: 8 }}>See All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Loading state */}
      {loading && (
        <View style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 24,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 120,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2
        }}>
          <ActivityIndicator size="small" color={colors.primary.main} />
          <Text style={{ color: '#6B7280', marginTop: 8 }}>Loading transactions...</Text>
        </View>
      )}

      {/* Error state */}
      {error && (
        <TouchableOpacity
          onPress={onRetry}
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 24,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 120,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2
          }}
        >
          <MaterialCommunityIcons name="alert-circle-outline" size={32} color="#EF4444" />
          <Text style={{ color: '#4B5563', textAlign: 'center', marginTop: 8, fontWeight: '500' }}>
            Unable to load transactions
          </Text>
          <Text style={{ color: '#6B7280', fontSize: 12, textAlign: 'center', marginTop: 4 }}>
            Tap to retry
          </Text>
        </TouchableOpacity>
      )}

      {/* Empty state */}
      {!loading && !error && (!transactions || transactions.length === 0) && (
        <View style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 24,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 120,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2
        }}>
          <MaterialCommunityIcons name="calendar-blank" size={32} color="#9CA3AF" />
          <Text style={{ color: '#4B5563', textAlign: 'center', marginTop: 8, fontWeight: '500' }}>
            No recent transactions
          </Text>
          <Text style={{ color: '#6B7280', fontSize: 12, textAlign: 'center', marginTop: 4 }}>
            Your transaction history will appear here
          </Text>
        </View>
      )}

      {/* Transactions list */}
      {!loading && !error && transactions && transactions.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          {transactions.slice(0, 2).map((transaction) => {
            // console.log('Transaction:', {
            //   id: transaction.id,
            //   credit_debit: transaction.credit_debit,
            //   type: transaction.type,
            //   amount: transaction.amount,
            //   description: transaction.description
            // });
            return (
              <View
                key={transaction.id}
                style={{
                  backgroundColor: 'white',
                  padding: 16,
                  borderRadius: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  marginBottom: 8,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: transaction.credit_debit === 'credit' ? '#D1FAE5' : '#FEE2E2',
                    borderRadius: 999,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <MaterialCommunityIcons 
                    name={transaction.credit_debit === 'credit' ? 'arrow-up' : 'arrow-down'} 
                    size={20} 
                    color={transaction.credit_debit === 'credit' ? '#10B981' : '#EF4444'} 
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontWeight: '500',
                      color: '#111827',
                      fontSize: 14,
                      marginBottom: 4,
                    }}
                  >
                    {transaction.description}
                  </Text>
                  <Text style={{ color: '#6B7280', fontSize: 12 }}>{transaction.date}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text
                    style={{
                      fontWeight: '600',
                      color: transaction.credit_debit === 'credit' ? '#10B981' : '#EF4444',
                      fontSize: 14,
                      marginBottom: 4,
                    }}
                  >
                    {transaction.credit_debit === 'credit' 
                      ? `+₦${transaction.amount.toLocaleString()}` 
                      : `-₦${transaction.amount.toLocaleString()}`
                    }
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color:
                        transaction.status === 'success'
                          ? '#10B981'
                          : transaction.status === 'pending'
                          ? '#F59E0B'
                          : '#EF4444',
                    }}
                  >
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};


export default TransactionHistory;