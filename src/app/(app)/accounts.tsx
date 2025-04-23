import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { api } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ErrorModal } from '@/components/common/ErrorModal';
import { SuccessModal } from '@/components/SuccessModal';
import { useRouter } from 'expo-router';

// Available currencies
const AVAILABLE_CURRENCIES = ['NGN', 'USD', 'EUR', 'GBP'];

interface Account {
  id: string;
  account_number: string;
  bank_name: string;
  currency: string;
  createdAt: string;
  // Optional fields with defaults
  accountType?: string;
  accountName?: string;
  sortCode?: string;
  iban?: string;
  routingNumber?: string;
  swiftCode?: string;
  balance?: number;
  availableBalance?: number;
  lastTransactionDate?: string;
  status?: string;
  country?: string;
  flagColors?: string[];
}

export default function Accounts() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');
  const [isLoading, setIsLoading] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleBack = () => router.back();

  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await api.accounts.fetchUserAccounts();
      // console.log("(accounts.tsx) -- API Response:", response);
      
      if (Array.isArray(response)) { 
        setAccounts(response);      
      } else {
        console.warn("(accounts.tsx) -- Invalid accounts data received:", response);
        setAccounts([]);
      }
    } catch (err) {
      console.error("(accounts.tsx) -- Error fetching accounts:", err);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to fetch accounts');
      setShowErrorModal(true);
      setAccounts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const generateNewAccount = async () => {
    try {
      setIsLoading(true);
      const response = await api.accounts.createPermanentAccount();

      await fetchAccounts();
      
      if (response.success) {
        // Fetch updated accounts list
        setIsLoading(true)
        await fetchAccounts();
        setIsLoading(false)
        setShowSuccessModal(true);
      }

      setIsLoading(false)

    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to generate account');
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrencySelector = () => (
    <View className="h-12 mb-4">
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="px-4"
        contentContainerStyle={{ height: 40, alignItems: 'center' }}
      >
        {AVAILABLE_CURRENCIES.map((currency) => (
          <TouchableOpacity
            key={currency}
            style={[
              { marginRight: 12, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
              selectedCurrency === currency 
                ? { backgroundColor: colors.primary.main } 
                : { backgroundColor: 'white' }
            ]}
            onPress={() => setSelectedCurrency(currency)}
          >
            <Text style={[
              { fontSize: 14, fontWeight: '500' },
              selectedCurrency === currency 
                ? { color: 'white' } 
                : { color: '#6B7280' }
            ]}>
              {currency}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderAccountCard = () => {
    if (!Array.isArray(accounts)) {
      console.warn("(accounts.tsx) -- Accounts is not an array:", accounts);
      return null;
    }

    const account = accounts.find(acc => 
      acc && acc.currency && acc.currency.toLowerCase() === selectedCurrency.toLowerCase()
    );
    
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center"> 
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      );
    }

    if (!account) {
      return (
        <View className="flex-1 justify-center items-center px-4">
          <Text className="text-gray-600 text-center mb-4">
            You don't have a {selectedCurrency} account yet 
          </Text>
          <TouchableOpacity 
            style={{
              backgroundColor: colors.primary.main,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 20
            }}
            onPress={generateNewAccount}
            disabled={isLoading}
          >
            <Text className="text-white font-medium">
              {isLoading ? 'Generating...' : 'Generate New Account'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View 
        className="mx-4 rounded-2xl p-5 shadow-sm"
        style={{ backgroundColor: colors.primary.main }}
      >
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-lg font-bold">{account.bank_name}</Text>
            <Text className="text-white/80 text-sm">Virtual Account</Text>
          </View>
          <View className="bg-white/20 px-3 py-1.5 rounded-full">
            <Text className="text-white font-medium">{account.currency.toUpperCase()}</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-white/80 text-sm mb-1">Account Number</Text>
          <Text className="text-white text-3xl font-bold">
            {account.account_number}
          </Text>
          <Text className="text-white/80 text-sm mt-1">
            Created: {account.createdAt}
          </Text>
        </View>

        <View className="bg-white/10 rounded-xl p-4">
          <View className="mb-3">
            <Text className="text-white/80 text-xs mb-1">Account ID</Text>
            <Text className="text-white text-sm font-medium">{account.id}</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderQuickActions = () => (
    <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 16 }}>Quick Actions</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity 
          onPress={() => router.push('/transfers')}
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 12,
            flex: 1,
            marginRight: 8,
            alignItems: 'center',
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <MaterialCommunityIcons name="bank-transfer" size={24} color={colors.primary.main} />
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginTop: 8 }}>Transfer</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => router.push('/funding')}
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 12,
            flex: 1,
            marginHorizontal: 8,
            alignItems: 'center',
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <MaterialCommunityIcons name="cash-plus" size={24} color={colors.primary.main} />
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginTop: 8 }}>Fund</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => router.push('/transactions')}
          style={{
            backgroundColor: 'white',
            padding: 16,
            borderRadius: 12,
            flex: 1,
            marginLeft: 8,
            alignItems: 'center',
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <MaterialCommunityIcons name="history" size={24} color={colors.primary.main} />
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginTop: 8 }}>History</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row justify-between items-center p-4">
        <Text className="text-2xl font-bold text-gray-900">Accounts</Text>
        <TouchableOpacity 
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.primary.main,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20
          }}
        >
          <MaterialCommunityIcons name="plus" size={16} color="white" />
          <Text className="text-white text-sm font-medium ml-1">Add Account</Text>
        </TouchableOpacity>
      </View>

      {renderCurrencySelector()}
      {renderAccountCard()}
      {renderQuickActions()}
      {/* {renderRecentTransactions()} */}

      <ErrorModal
        visible={showErrorModal}
        error={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />

      <SuccessModal
        visible={showSuccessModal}
        title="Account Created"
        message="Your new account has been successfully created"
        onClose={() => setShowSuccessModal(false)}
        autoClose={true}
        autoCloseTime={3000}
      />
    </SafeAreaView>
  );
} 