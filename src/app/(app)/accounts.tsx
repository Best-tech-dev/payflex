import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { api } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Available currencies
const AVAILABLE_CURRENCIES = ['NGN', 'USD', 'EUR', 'GBP'];

interface Account {
  id: string;
  currency: string;
  accountNumber: string;
  bankName: string;
  accountType: string;
  accountName: string;
  sortCode?: string;
  iban?: string;
  swiftCode: string;
  balance: number;
  availableBalance: number;
  lastTransactionDate: string;
  status: string;
  country: string;
  flagColors: string[];
}

export default function Accounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState('NGN');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = async () => {
    try {
      // Check cache first
      const cachedAccounts = await AsyncStorage.getItem('user_accounts');
      if (cachedAccounts) {
        setAccounts(JSON.parse(cachedAccounts));
        setIsLoading(false);
        return;
      }

      // If no cache, fetch from API
      const response = await api.wallet.fetchWallet();
      const userAccounts = response.accounts || [];
      
      // Transform API response to match our Account interface
      const formattedAccounts = userAccounts.map((account: any) => ({
        id: account.id,
        currency: account.currency,
        accountNumber: account.accountNumber,
        bankName: account.bankName || 'PayFlex Bank',
        accountType: account.accountType || 'Savings',
        accountName: account.accountName,
        sortCode: account.sortCode,
        iban: account.iban,
        swiftCode: account.swiftCode,
        balance: account.balance,
        availableBalance: account.availableBalance,
        lastTransactionDate: account.lastTransactionDate,
        status: account.status,
        country: account.country,
        flagColors: getFlagColors(account.currency)
      }));

      // Cache the accounts
      await AsyncStorage.setItem('user_accounts', JSON.stringify(formattedAccounts));
      
      setAccounts(formattedAccounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch accounts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const getFlagColors = (currency: string): string[] => {
    switch (currency) {
      case 'NGN':
        return ['#008751', '#FFFFFF', '#008751'];
      case 'USD':
        return ['#B22234', '#FFFFFF', '#3C3B6E'];
      case 'EUR':
        return ['#003399', '#FFCC00', '#003399'];
      case 'GBP':
        return ['#012169', '#FFFFFF', '#C8102E'];
      default:
        return ['#008751', '#FFFFFF', '#008751'];
    }
  };

  const generateNewAccount = async () => {
    try {
      setIsLoading(true);
      const response = await api.wallet.generateOneTimeAccount(0); // 0 amount for now
      // Refresh accounts after generating new one
      await fetchAccounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate account');
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
    const account = accounts.find(acc => acc.currency === selectedCurrency);
    
    if (isLoading) {
      return (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary.main} />
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 text-center">{error}</Text>
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
            className="bg-primary px-6 py-3 rounded-full"
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
        style={{ backgroundColor: account.flagColors[0] }}
      >
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-lg font-bold">{account.bankName}</Text>
            <Text className="text-white/80 text-sm">{account.accountType}</Text>
          </View>
          <View className="bg-white/20 px-3 py-1.5 rounded-full">
            <Text className="text-white font-medium">{account.currency}</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-white/80 text-sm mb-1">Available Balance</Text>
          <Text className="text-white text-3xl font-bold">
            {account.currency} {account.availableBalance.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </Text>
          <Text className="text-white/80 text-sm mt-1">
            Total Balance: {account.currency} {account.balance.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </Text>
        </View>

        <View className="bg-white/10 rounded-xl p-4">
          <View className="mb-3">
            <Text className="text-white/80 text-xs mb-1">Account Number</Text>
            <Text className="text-white text-sm font-medium">{account.accountNumber}</Text>
          </View>
          {account.routingNumber && (
            <View className="mb-3">
              <Text className="text-white/80 text-xs mb-1">Routing Number</Text>
              <Text className="text-white text-sm font-medium">{account.routingNumber}</Text>
            </View>
          )}
          {account.sortCode && (
            <View className="mb-3">
              <Text className="text-white/80 text-xs mb-1">Sort Code</Text>
              <Text className="text-white text-sm font-medium">{account.sortCode}</Text>
            </View>
          )}
          {account.iban && (
            <View className="mb-3">
              <Text className="text-white/80 text-xs mb-1">IBAN</Text>
              <Text className="text-white text-sm font-medium">{account.iban}</Text>
            </View>
          )}
          <View>
            <Text className="text-white/80 text-xs mb-1">SWIFT Code</Text>
            <Text className="text-white text-sm font-medium">{account.swiftCode}</Text>
          </View>
        </View>
      </View>
    );
  };

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
    </SafeAreaView>
  );
} 