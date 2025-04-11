import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TransactionHistory from '@/components/TransactionHistory';

// Mock data for bank accounts
const bankAccounts = [
  { 
    id: '1', 
    currency: 'USD',
    accountNumber: '1234567890',
    bankName: 'PayFlex Bank',
    balance: 12345.67,
    transactions: [
      { id: '1', type: 'credit' as const, amount: 5000, description: 'Salary Payment', date: 'Apr 8th, 17:23:58', status: 'successful' as const },
      { id: '2', type: 'debit' as const, amount: 1500, description: 'Netflix Subscription', date: 'Apr 7th, 14:15:30', status: 'pending' as const },
      { id: '3', type: 'credit' as const, amount: 2000, description: 'Freelance Work', date: 'Apr 6th, 09:45:12', status: 'successful' as const },
    ]
  },
  { 
    id: '2', 
    currency: 'EUR',
    accountNumber: '0987654321',
    bankName: 'PayFlex Bank',
    balance: 4567.89,
    transactions: [
      { id: '4', type: 'credit' as const, amount: 1000, description: 'Client Payment', date: 'Apr 5th, 11:30:45', status: 'successful' as const },
      { id: '5', type: 'debit' as const, amount: 500, description: 'Amazon Purchase', date: 'Apr 4th, 16:20:10', status: 'successful' as const },
    ]
  },
];

export default function Accounts() {
  const [selectedAccount, setSelectedAccount] = useState(bankAccounts[0]);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>Accounts</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity 
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  backgroundColor: 'white', 
                  padding: 8, 
                  borderRadius: 8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                }}
                onPress={() => setShowCurrencyModal(true)}
              >
                <Text style={{ marginRight: 8, color: '#111827' }}>{selectedAccount.currency}</Text>
                <MaterialCommunityIcons name="chevron-down" size={16} color="#111827" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  backgroundColor: colors.primary.main, 
                  paddingHorizontal: 12,
                  paddingVertical: 8, 
                  borderRadius: 20,
                }}
              >
                <MaterialCommunityIcons name="plus" size={16} color="white" />
                <Text style={{ marginLeft: 4, color: 'white', fontSize: 12, fontWeight: '500' }}>Add Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Account Details */}
        <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 16, 
            padding: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          }}>
            <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 8 }}>Account Number</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 16 }}>
              {selectedAccount.accountNumber}
            </Text>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ color: '#6B7280', fontSize: 14 }}>Bank Name</Text>
                <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>{selectedAccount.bankName}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: '#6B7280', fontSize: 14 }}>Available Balance</Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>
                  {selectedAccount.currency} {selectedAccount.balance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Transaction History */}
        <TransactionHistory 
          transactions={selectedAccount.transactions}
          onViewAll={() => {}}
        />
      </ScrollView>

      {/* Currency Selection Modal */}
      <Modal
        visible={showCurrencyModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCurrencyModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' }}>
          <View style={{ 
            backgroundColor: 'white', 
            borderTopLeftRadius: 24, 
            borderTopRightRadius: 24, 
            padding: 24 
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>Select Account</Text>
              <TouchableOpacity onPress={() => setShowCurrencyModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>
            {bankAccounts.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  paddingVertical: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: '#E5E7EB'
                }}
                onPress={() => {
                  setSelectedAccount(account);
                  setShowCurrencyModal(false);
                }}
              >
                <View>
                  <Text style={{ fontSize: 16, fontWeight: '500', color: '#111827' }}>{account.currency} Account</Text>
                  <Text style={{ fontSize: 14, color: '#6B7280' }}>{account.accountNumber}</Text>
                </View>
                <Text style={{ fontSize: 16, color: '#111827' }}>
                  {account.currency} {account.balance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
} 