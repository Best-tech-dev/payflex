import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, SafeAreaView, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { Loader } from '@/components/Loader';
import { SuccessModal } from '@/components/SuccessModal';
import { router } from 'expo-router';
import { api } from '@/services/api';

// Define the type for betting provider
type BettingProvider = {
  provider: string;
  providerLogoUrl: string;
  minAmount: string;
  maxAmount: string;
};

const QUICK_AMOUNTS = [500, 1000, 3000, 5000, 7000, 10000];

export default function Betting() {
  const [selectedProvider, setSelectedProvider] = useState<BettingProvider | null>(null);
  const [userId, setUserId] = useState('');
  const [bettingProviders, setBettingProviders] = useState<BettingProvider[]>([]);
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [manualAmount, setManualAmount] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const getBettingProviders = async () => {
      const res = await api.vas.getBettingProviders();
      setBettingProviders(res);
      // Set SportyBet as default provider
      const sportyBet = res.find((provider: BettingProvider) => provider.provider.toLowerCase() === 'sportybet');
      if (sportyBet) {
        setSelectedProvider(sportyBet);
      }
    }

    getBettingProviders();
  }, []);

  // Get placeholder text based on selected provider
  const getUserIdPlaceholder = () => {
    if (!selectedProvider) return 'Select a provider first';
    
    const provider = selectedProvider.provider.toLowerCase();
    if (provider.includes('sportybet')) return 'Enter SportyBet phone number';
    if (provider.includes('bet9ja')) return 'Enter Bet9ja phone number';
    if (provider.includes('betking')) return 'Enter BetKing phone number';
    if (provider.includes('betway')) return 'Enter BetWay phone number';
    if (provider.includes('merrybet')) return 'Enter MerryBet phone number';
    if (provider.includes('melbet')) return 'Enter MelBet phone number';
    if (provider.includes('betlion')) return 'Enter BetLion phone number';
    if (provider.includes('naijabet')) return 'Enter Nairabet phone number';
    if (provider.includes('bangbet')) return 'Enter BangBet phone number';
    if (provider.includes('one_xbet')) return 'Enter 1xBet phone number';
    
    return `Enter ${selectedProvider.provider} phone number`;
  };

  const handleProceed = () => {
    if (!selectedProvider) return;
    
    const amount = selectedAmount || (manualAmount ? parseFloat(manualAmount) : null);
    if (amount && amount >= parseFloat(selectedProvider.minAmount) && amount <= parseFloat(selectedProvider.maxAmount)) {
      setShowLoading(true);
      // Simulate API call
      setTimeout(() => {
        setShowLoading(false);
        setShowSuccess(true);
        // Reset form
        setUserId('');
        setSelectedProvider(null);
        setSelectedAmount(null);
        setManualAmount('');
      }, 2000);
    }
  };

  const isUserIdValid = userId.length === 11;
  const isAmountValid = selectedAmount || (manualAmount && parseFloat(manualAmount) > 0);

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

        <ScrollView style={styles.modalScrollView}>
          <View style={styles.providersGrid}>
            {bettingProviders.map(provider => (
              <TouchableOpacity
                key={provider.provider}
                onPress={() => {
                  setSelectedProvider(provider);
                  setShowProviderModal(false);
                }}
                style={styles.providerCard}
              >
                <View style={styles.providerLogoContainer}>
                  <Image 
                    source={{ uri: provider.providerLogoUrl }} 
                    style={styles.providerLogo}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.providerDetails}>
                  <Text style={styles.providerName}>{provider.provider}</Text>
                  <Text style={styles.providerRange}>
                    ₦{parseFloat(provider.minAmount).toLocaleString()} - ₦{parseFloat(provider.maxAmount).toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );

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
              {selectedProvider ? (
                <>
                  <View style={styles.providerIcon}>
                    <Image 
                      source={{ uri: selectedProvider.providerLogoUrl }} 
                      style={styles.providerLogo}
                      resizeMode="contain"
                    />
                  </View>
                  <View>
                    <Text style={styles.selectedProviderName}>{selectedProvider.provider}</Text>
                    <Text style={styles.providerRange}>
                      ₦{parseFloat(selectedProvider.minAmount).toLocaleString()} - ₦{parseFloat(selectedProvider.maxAmount).toLocaleString()}
                    </Text>
                  </View>
                </>
              ) : (
                <Text style={styles.placeholderText}>Select a provider</Text>
              )}
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* User ID Input */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>User ID</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder={selectedProvider ? getUserIdPlaceholder() : 'Select a provider first'}
              placeholderTextColor="#9CA3AF"
              value={userId}
              onChangeText={setUserId}
              keyboardType="numeric"
              maxLength={11}
              style={styles.input}
            />
          </View>
        </View>

        {/* Quick Amount Buttons */}
        <View style={[styles.section, !isUserIdValid && styles.disabledSection]}>
          <Text style={styles.sectionLabel}>Select Amount</Text>
          <View style={styles.quickAmountsGrid}>
            {QUICK_AMOUNTS.map((amount) => (
              <TouchableOpacity
                key={amount}
                onPress={() => {
                  if (isUserIdValid) {
                    setSelectedAmount(amount);
                    setManualAmount('');
                  }
                }}
                style={[
                  styles.quickAmountCard,
                  selectedAmount === amount && styles.selectedQuickAmountCard,
                  !isUserIdValid && styles.disabledCard
                ]}
                disabled={!isUserIdValid}
              >
                <Text style={[styles.quickAmountValue, !isUserIdValid && styles.disabledText]}>
                  ₦{amount.toLocaleString()}
                </Text>
                <Text style={[styles.quickAmountLabel, !isUserIdValid && styles.disabledText]}>
                  Pay ₦{amount.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Manual Amount Input */}
          <View style={styles.manualAmountContainer}>
            <View style={[styles.manualAmountWrapper, !isUserIdValid && styles.disabledInput]}>
              <Text style={styles.currencySymbol}>₦</Text>
              <TextInput
                placeholder="Enter amount"
                value={manualAmount}
                onChangeText={(text) => {
                  if (isUserIdValid) {
                    setManualAmount(text);
                    setSelectedAmount(null);
                  }
                }}
                keyboardType="numeric"
                style={styles.manualAmountInput}
                editable={isUserIdValid}
              />
            </View>
            <TouchableOpacity
              onPress={handleProceed}
              style={[
                styles.payButton,
                (!isAmountValid || !isUserIdValid) && styles.disabledPayButton
              ]}
              disabled={!isAmountValid || !isUserIdValid}
            >
              <Text style={styles.payButtonText}>Pay</Text>
            </TouchableOpacity>
          </View>

          {selectedProvider && (
            <Text style={styles.amountRange}>
              Min: ₦{parseFloat(selectedProvider.minAmount).toLocaleString()} | Max: ₦{parseFloat(selectedProvider.maxAmount).toLocaleString()}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Provider Selection Modal */}
      {showProviderModal && renderProviderModal()}

      {/* Loading Modal */}
      <Loader visible={showLoading} message="Processing your request..." />

      {/* Success Modal */}
      <SuccessModal 
        visible={showSuccess} 
        title="Success" 
        message="Your payment has been processed successfully!" 
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    height: '100%',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    zIndex: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
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
  modalScrollView: {
    marginTop: 16,
  },
  providersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  providerCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  providerLogoContainer: {
    width: '100%',
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  providerLogo: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  providerDetails: {
    alignItems: 'center',
  },
  providerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
    textAlign: 'center',
  },
  providerRange: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#6B7280',
  },
  quickAmountsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickAmountCard: {
    width: '31%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedQuickAmountCard: {
    borderColor: colors.primary.main,
    borderWidth: 2,
    backgroundColor: '#F3F4F6',
  },
  quickAmountValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  quickAmountLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  manualAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  manualAmountWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    marginRight: 12,
  },
  manualAmountInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    height: '100%',
    marginLeft: 8,
  },
  payButton: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 24,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledPayButton: {
    backgroundColor: '#D1D5DB',
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  amountRange: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 16,
  },
  disabledSection: {
    opacity: 0.5,
  },
  disabledCard: {
    backgroundColor: '#F3F4F6',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  disabledInput: {
    backgroundColor: '#F3F4F6',
  },
  currencySymbol: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
}); 