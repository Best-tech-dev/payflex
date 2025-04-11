import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { Loader } from '@/components/Loader';
import { SuccessModal } from '@/components/SuccessModal';
import { router } from 'expo-router';
import { Slider } from '@/components/common/Slider';

// Mock data for electricity providers
const ELECTRICITY_PROVIDERS = [
  { id: '1', name: 'IKEDC', code: 'IKEDC', icon: 'flash' as const },
  { id: '2', name: 'EKEDC', code: 'EKEDC', icon: 'flash' as const },
  { id: '3', name: 'AEDC', code: 'AEDC', icon: 'flash' as const },
  { id: '4', name: 'EEDC', code: 'EEDC', icon: 'flash' as const },
  { id: '5', name: 'KEDCO', code: 'KEDCO', icon: 'flash' as const },
];

// Mock data for meter types
const METER_TYPES = [
  { id: '1', name: 'Prepaid', code: 'PREPAID' },
  { id: '2', name: 'Postpaid', code: 'POSTPAID' },
];

// Mock data for electricity plans
const ELECTRICITY_PLANS = {
  IKEDC: {
    PREPAID: [
      { id: '1', name: '₦1,000', units: 50, price: 1000 },
      { id: '2', name: '₦2,000', units: 100, price: 2000 },
      { id: '3', name: '₦5,000', units: 250, price: 5000 },
      { id: '4', name: '₦10,000', units: 500, price: 10000 },
      { id: '5', name: '₦20,000', units: 1000, price: 20000 },
      { id: '6', name: '₦50,000', units: 2500, price: 50000 },
    ],
    POSTPAID: [
      { id: '1', name: 'Pay Bill', minAmount: 1000, maxAmount: 1000000 },
    ],
  },
  EKEDC: {
    PREPAID: [
      { id: '1', name: '₦1,000', units: 50, price: 1000 },
      { id: '2', name: '₦2,000', units: 100, price: 2000 },
      { id: '3', name: '₦5,000', units: 250, price: 5000 },
      { id: '4', name: '₦10,000', units: 500, price: 10000 },
      { id: '5', name: '₦20,000', units: 1000, price: 20000 },
      { id: '6', name: '₦50,000', units: 2500, price: 50000 },
    ],
    POSTPAID: [
      { id: '1', name: 'Pay Bill', minAmount: 1000, maxAmount: 1000000 },
    ],
  },
  AEDC: {
    PREPAID: [
      { id: '1', name: '₦1,000', units: 50, price: 1000 },
      { id: '2', name: '₦2,000', units: 100, price: 2000 },
      { id: '3', name: '₦5,000', units: 250, price: 5000 },
      { id: '4', name: '₦10,000', units: 500, price: 10000 },
      { id: '5', name: '₦20,000', units: 1000, price: 20000 },
      { id: '6', name: '₦50,000', units: 2500, price: 50000 },
    ],
    POSTPAID: [
      { id: '1', name: 'Pay Bill', minAmount: 1000, maxAmount: 1000000 },
    ],
  },
  EEDC: {
    PREPAID: [
      { id: '1', name: '₦1,000', units: 50, price: 1000 },
      { id: '2', name: '₦2,000', units: 100, price: 2000 },
      { id: '3', name: '₦5,000', units: 250, price: 5000 },
      { id: '4', name: '₦10,000', units: 500, price: 10000 },
      { id: '5', name: '₦20,000', units: 1000, price: 20000 },
      { id: '6', name: '₦50,000', units: 2500, price: 50000 },
    ],
    POSTPAID: [
      { id: '1', name: 'Pay Bill', minAmount: 1000, maxAmount: 1000000 },
    ],
  },
  KEDCO: {
    PREPAID: [
      { id: '1', name: '₦1,000', units: 50, price: 1000 },
      { id: '2', name: '₦2,000', units: 100, price: 2000 },
      { id: '3', name: '₦5,000', units: 250, price: 5000 },
      { id: '4', name: '₦10,000', units: 500, price: 10000 },
      { id: '5', name: '₦20,000', units: 1000, price: 20000 },
      { id: '6', name: '₦50,000', units: 2500, price: 50000 },
    ],
    POSTPAID: [
      { id: '1', name: 'Pay Bill', minAmount: 1000, maxAmount: 1000000 },
    ],
  },
};

// Mock customer data
const MOCK_CUSTOMERS = {
  '1234567890': { name: 'John Doe', address: '123 Main St, Lagos', balance: 5000, type: 'PREPAID' },
  '9876543210': { name: 'Jane Smith', address: '456 Oak Ave, Abuja', balance: 12000, type: 'POSTPAID' },
  '5555555555': { name: 'Michael Johnson', address: '789 Pine Rd, Port Harcourt', balance: 3000, type: 'PREPAID' },
};

export default function Electricity() {
  const [selectedProvider, setSelectedProvider] = useState<typeof ELECTRICITY_PROVIDERS[0]>(ELECTRICITY_PROVIDERS[0]); // Default to IKEDC
  const [selectedMeterType, setSelectedMeterType] = useState<typeof METER_TYPES[0]>(METER_TYPES[0]); // Default to Prepaid
  const [meterNumber, setMeterNumber] = useState('');
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; units?: number; price: number; minAmount?: number; maxAmount?: number } | null>(null);
  const [amount, setAmount] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [customerAddress, setCustomerAddress] = useState<string | null>(null);
  const [customerBalance, setCustomerBalance] = useState<number | null>(null);
  const [isMeterVerified, setIsMeterVerified] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(1000);

  // Handle meter number change
  const handleMeterChange = (text: string) => {
    setMeterNumber(text);
    setIsMeterVerified(false);
    setCustomerName(null);
    setCustomerAddress(null);
    setCustomerBalance(null);
  };

  const handleVerify = () => {
    if (meterNumber.length >= 10) {
      setShowLoading(true);
      // Simulate API call to verify meter
      setTimeout(() => {
        // Check if meter exists in mock data
        const customer = MOCK_CUSTOMERS[meterNumber as keyof typeof MOCK_CUSTOMERS];
        if (customer) {
          setCustomerName(customer.name);
          setCustomerAddress(customer.address);
          setCustomerBalance(customer.balance);
          setSelectedMeterType(METER_TYPES.find(type => type.code === customer.type) || METER_TYPES[0]);
          setIsMeterVerified(true);
        } else {
          // For any other number, use a generic name
          setCustomerName('Customer');
          setCustomerAddress('Address not available');
          setCustomerBalance(0);
          setIsMeterVerified(true);
        }
        setShowLoading(false);
      }, 2000);
    }
  };

  const handleProceed = () => {
    if (selectedPlan) {
      setShowLoading(true);
      // Simulate API call
      setTimeout(() => {
        setShowLoading(false);
        setShowSuccess(true);
        // Reset form
        setMeterNumber('');
        setSelectedProvider(ELECTRICITY_PROVIDERS[0]); // Reset to IKEDC
        setSelectedMeterType(METER_TYPES[0]); // Reset to Prepaid
        setSelectedPlan(null);
        setAmount('');
        setIsMeterVerified(false);
        setCustomerName(null);
        setCustomerAddress(null);
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
          {ELECTRICITY_PROVIDERS.map(provider => (
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

  const renderMeterTypeSelector = () => (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Meter Type</Text>
      <View style={styles.meterTypeContainer}>
        {METER_TYPES.map(type => (
          <TouchableOpacity
            key={type.id}
            onPress={() => setSelectedMeterType(type)}
            style={[
              styles.meterTypeButton,
              selectedMeterType.id === type.id && styles.selectedMeterTypeButton
            ]}
          >
            <Text style={[
              styles.meterTypeText,
              selectedMeterType.id === type.id && styles.selectedMeterTypeText
            ]}>
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPlans = () => {
    if (!selectedProvider || !selectedMeterType) return null;
    
    const plans = ELECTRICITY_PLANS[selectedProvider.code as keyof typeof ELECTRICITY_PLANS]?.[selectedMeterType.code as keyof typeof ELECTRICITY_PLANS[keyof typeof ELECTRICITY_PLANS]] || [];
    
    return (
      <View style={styles.plansContainer}>
        <Text style={styles.sectionLabel}>Select Plan</Text>
        <View style={styles.plansGrid}>
          {plans.map(plan => (
            <TouchableOpacity
              key={plan.id}
              onPress={() => isMeterVerified && setSelectedPlan(plan)}
              style={[
                styles.planCard, 
                selectedPlan?.id === plan.id && styles.selectedPlanCard,
                !isMeterVerified && styles.disabledPlanCard
              ]}
              disabled={!isMeterVerified}
            >
              <Text style={styles.planName}>{plan.name}</Text>
              {plan.units && (
                <Text style={styles.planUnits}>{plan.units} units</Text>
              )}
              {plan.minAmount && plan.maxAmount && (
                <Text style={styles.planRange}>
                  ₦{plan.minAmount.toLocaleString()} - ₦{plan.maxAmount.toLocaleString()}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {selectedPlan && isMeterVerified && selectedMeterType.code === 'POSTPAID' && (
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
              Min: ₦{selectedPlan.minAmount?.toLocaleString()} | Max: ₦{selectedPlan.maxAmount?.toLocaleString()}
            </Text>
            
            <TouchableOpacity
              onPress={handleProceed}
              style={[
                styles.proceedButton,
                (!amount || parseInt(amount) < (selectedPlan.minAmount || 0) || parseInt(amount) > (selectedPlan.maxAmount || 0)) && styles.disabledButton
              ]}
              disabled={!amount || parseInt(amount) < (selectedPlan.minAmount || 0) || parseInt(amount) > (selectedPlan.maxAmount || 0)}
            >
              <Text style={styles.proceedButtonText}>
                Pay Bill
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedPlan && isMeterVerified && selectedMeterType.code === 'PREPAID' && (
          <TouchableOpacity
            onPress={handleProceed}
            style={styles.proceedButton}
          >
            <Text style={styles.proceedButtonText}>
              Purchase {selectedPlan.name}
            </Text>
          </TouchableOpacity>
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

        {/* Meter Type Selection */}
        {renderMeterTypeSelector()}

        {/* Meter Number */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Meter Number</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter meter number"
              value={meterNumber}
              onChangeText={handleMeterChange}
              keyboardType="numeric"
              maxLength={10}
              style={styles.input}
            />
            {meterNumber.length >= 10 && (
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
              <Text style={styles.customerName}>Customer: {customerName}</Text>
              <Text style={styles.customerAddress}>Address: {customerAddress}</Text>
              {customerBalance !== null && (
                <Text style={styles.customerBalance}>
                  {selectedMeterType.code === 'POSTPAID' ? 'Outstanding Balance' : 'Current Balance'}: ₦{customerBalance.toLocaleString()}
                </Text>
              )}
            </View>
          )}
        </View>

        {/* Electricity Plans */}
        {selectedProvider && renderPlans()}

        {/* Token Amount Selection */}
        {isMeterVerified && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Token Amount</Text>
            <Slider
              value={tokenAmount}
              minimumValue={100}
              maximumValue={10000}
              step={100}
              onValueChange={setTokenAmount}
              label="Amount (₦)"
            />
            <TouchableOpacity
              style={styles.proceedButton}
              onPress={handleProceed}
              disabled={!isMeterVerified}
            >
              <Text style={styles.proceedButtonText}>Proceed</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Provider Selection Modal */}
      {showProviderModal && renderProviderModal()}

      {/* Loading Modal */}
      <Loader visible={showLoading} message="Processing your request..." />

      {/* Success Modal */}
      <SuccessModal 
        visible={showSuccess} 
        title="Success" 
        message={`Your electricity ${selectedMeterType.code === 'PREPAID' ? 'purchase' : 'bill payment'} has been processed successfully!`} 
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
  meterTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  meterTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedMeterTypeButton: {
    backgroundColor: colors.primary.main,
  },
  meterTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  selectedMeterTypeText: {
    color: 'white',
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
  customerAddress: {
    fontSize: 14,
    color: '#111827',
    marginTop: 4,
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
  plansContainer: {
    marginTop: 24,
  },
  plansGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  planCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedPlanCard: {
    borderWidth: 2,
    borderColor: colors.primary.main,
  },
  disabledPlanCard: {
    opacity: 0.5,
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  planUnits: {
    fontSize: 14,
    color: '#6B7280',
  },
  planRange: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  providerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  providerCard: {
    width: '47%',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedProvider: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light,
  },
  selectedProviderText: {
    color: colors.primary.main,
    fontWeight: '500',
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    marginTop: 16,
    fontSize: 16,
    color: '#111827',
    textAlign: 'center',
  },
}); 