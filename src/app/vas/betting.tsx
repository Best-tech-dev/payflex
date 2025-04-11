import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { Loader } from '@/components/Loader';
import { SuccessModal } from '@/components/SuccessModal';
import { router } from 'expo-router';

// Mock data for betting providers
const BETTING_PROVIDERS = [
  { id: '1', name: 'SportyBet', code: 'SPORTYBET', icon: 'soccer' as const },
  { id: '2', name: 'Bet9ja', code: 'BET9JA', icon: 'soccer' as const },
  { id: '3', name: 'BetKing', code: 'BETKING', icon: 'soccer' as const },
  { id: '4', name: 'NairaBet', code: 'NAIRABET', icon: 'soccer' as const },
];

// Mock data for betting options
const BETTING_OPTIONS = {
  SPORTYBET: [
    { id: '1', name: 'Fund Wallet', minAmount: 1000, maxAmount: 1000000 },
    { id: '2', name: 'Withdraw', minAmount: 1000, maxAmount: 1000000 },
  ],
  BET9JA: [
    { id: '1', name: 'Fund Wallet', minAmount: 1000, maxAmount: 1000000 },
    { id: '2', name: 'Withdraw', minAmount: 1000, maxAmount: 1000000 },
  ],
  BETKING: [
    { id: '1', name: 'Fund Wallet', minAmount: 1000, maxAmount: 1000000 },
    { id: '2', name: 'Withdraw', minAmount: 1000, maxAmount: 1000000 },
  ],
  NAIRABET: [
    { id: '1', name: 'Fund Wallet', minAmount: 1000, maxAmount: 1000000 },
    { id: '2', name: 'Withdraw', minAmount: 1000, maxAmount: 1000000 },
  ],
};

// Mock customer data
const MOCK_CUSTOMERS = {
  '1234567890': { name: 'John Doe', balance: 5000 },
  '9876543210': { name: 'Jane Smith', balance: 12000 },
  '5555555555': { name: 'Michael Johnson', balance: 3000 },
};

export default function Betting() {
  const [selectedProvider, setSelectedProvider] = useState<typeof BETTING_PROVIDERS[0]>(BETTING_PROVIDERS[0]); // Default to SportyBet
  const [accountNumber, setAccountNumber] = useState('');
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState<{ id: string; name: string; minAmount: number; maxAmount: number } | null>(null);
  const [amount, setAmount] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [customerBalance, setCustomerBalance] = useState<number | null>(null);
  const [isAccountVerified, setIsAccountVerified] = useState(false);

  // Handle account number change
  const handleAccountChange = (text: string) => {
    setAccountNumber(text);
    setIsAccountVerified(false);
    setCustomerName(null);
    setCustomerBalance(null);
  };

  const handleVerify = () => {
    if (accountNumber.length >= 10) {
      setShowLoading(true);
      // Simulate API call to verify account
      setTimeout(() => {
        // Check if account exists in mock data
        const customer = MOCK_CUSTOMERS[accountNumber as keyof typeof MOCK_CUSTOMERS];
        if (customer) {
          setCustomerName(customer.name);
          setCustomerBalance(customer.balance);
          setIsAccountVerified(true);
        } else {
          // For any other number, use a generic name
          setCustomerName('Customer');
          setCustomerBalance(0);
          setIsAccountVerified(true);
        }
        setShowLoading(false);
      }, 2000);
    }
  };

  const handleProceed = () => {
    if (selectedOption && amount && parseInt(amount) >= selectedOption.minAmount && parseInt(amount) <= selectedOption.maxAmount) {
      setShowLoading(true);
      // Simulate API call
      setTimeout(() => {
        setShowLoading(false);
        setShowSuccess(true);
        // Reset form
        setAccountNumber('');
        setSelectedProvider(BETTING_PROVIDERS[0]); // Reset to SportyBet
        setSelectedOption(null);
        setAmount('');
        setIsAccountVerified(false);
        setCustomerName(null);
        setCustomerBalance(null);
      }, 2000);
    }
  };

  const renderProviderModal = () => (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowProviderModal(false)}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Select Provider</Text>
          <TouchableOpacity 
            onPress={() => setShowProviderModal(false)}
            style={styles.closeButton}
          >
            <MaterialCommunityIcons name="close" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView>
          {BETTING_PROVIDERS.map(provider => (
            <TouchableOpacity
              key={provider.id}
              onPress={() => {
                setSelectedProvider(provider);
                setShowProviderModal(false);
              }}
              style={styles.providerItem}
            >
              <View style={styles.providerIcon}>
                <MaterialCommunityIcons name={provider.icon} size={24} color={colors.primary.main} />
              </View>
              <Text style={styles.providerName}>{provider.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  const renderOptions = () => {
    if (!selectedProvider) return null;
    
    const options = BETTING_OPTIONS[selectedProvider.code as keyof typeof BETTING_OPTIONS] || [];
    
    return (
      <View style={styles.optionsContainer}>
        <Text style={styles.sectionLabel}>Select Option</Text>
        <View style={styles.optionsGrid}>
          {options.map(option => (
            <TouchableOpacity
              key={option.id}
              onPress={() => isAccountVerified && setSelectedOption(option)}
              style={[
                styles.optionCard, 
                selectedOption?.id === option.id && styles.selectedOptionCard,
                !isAccountVerified && styles.disabledOptionCard
              ]}
              disabled={!isAccountVerified}
            >
              <Text style={styles.optionName}>{option.name}</Text>
              <Text style={styles.optionRange}>
                ₦{option.minAmount.toLocaleString()} - ₦{option.maxAmount.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedOption && isAccountVerified && (
          <View style={styles.amountContainer}>
            <Text style={styles.sectionLabel}>Enter Amount</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>₦</Text>
              <TextInput
                placeholder="Enter amount"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                style={styles.amountInput}
              />
            </View>
            <Text style={styles.amountRange}>
              Min: ₦{selectedOption.minAmount.toLocaleString()} | Max: ₦{selectedOption.maxAmount.toLocaleString()}
            </Text>
            
            <TouchableOpacity
              onPress={handleProceed}
              style={[
                styles.proceedButton,
                (!amount || parseInt(amount) < selectedOption.minAmount || parseInt(amount) > selectedOption.maxAmount) && styles.disabledButton
              ]}
              disabled={!amount || parseInt(amount) < selectedOption.minAmount || parseInt(amount) > selectedOption.maxAmount}
            >
              <Text style={styles.proceedButtonText}>
                {selectedOption.name === 'Fund Wallet' ? 'Fund Wallet' : 'Withdraw'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Provider Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Select Provider</Text>
          <TouchableOpacity 
            onPress={() => setShowProviderModal(true)}
            style={styles.providerSelector}
          >
            <View style={styles.providerInfo}>
              <View style={styles.providerIcon}>
                <MaterialCommunityIcons name={selectedProvider.icon} size={24} color={colors.primary.main} />
              </View>
              <Text style={styles.selectedProviderName}>{selectedProvider.name}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Account Number */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account Number</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter account number"
              value={accountNumber}
              onChangeText={handleAccountChange}
              keyboardType="numeric"
              maxLength={10}
              style={styles.input}
            />
            {accountNumber.length >= 10 && (
              <TouchableOpacity
                onPress={handleVerify}
                style={styles.verifyButton}
              >
                <Text style={styles.verifyButtonText}>Verify</Text>
              </TouchableOpacity>
            )}
          </View>
          {customerName && (
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>Account: {customerName}</Text>
              <Text style={styles.customerBalance}>Balance: ₦{customerBalance?.toLocaleString()}</Text>
            </View>
          )}
        </View>

        {/* Betting Options */}
        {selectedProvider && renderOptions()}
      </ScrollView>

      {/* Provider Selection Modal */}
      {showProviderModal && renderProviderModal()}

      {/* Loading Modal */}
      <Loader visible={showLoading} message="Processing your request..." />

      {/* Success Modal */}
      <SuccessModal 
        visible={showSuccess} 
        title="Success" 
        message={`Your ${selectedOption?.name.toLowerCase()} request has been processed successfully!`} 
        onClose={() => setShowSuccess(false)} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  providerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
  providerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedProviderName: {
    fontSize: 16,
    color: '#111827',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  verifyButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  customerInfo: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  customerName: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  customerBalance: {
    fontSize: 14,
    color: '#111827',
    marginTop: 4,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 16,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  providerName: {
    fontSize: 16,
    color: '#111827',
  },
  optionsContainer: {
    marginTop: 24,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedOptionCard: {
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  disabledOptionCard: {
    opacity: 0.5,
  },
  optionName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  optionRange: {
    fontSize: 14,
    color: '#6B7280',
  },
  amountContainer: {
    marginTop: 16,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  currencySymbol: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  amountRange: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 16,
  },
  proceedButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 