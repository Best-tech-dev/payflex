import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { Loader } from '@/components/Loader';
import { SuccessModal } from '@/components/SuccessModal';
import { router } from 'expo-router';

// Mock data for TV providers
const TV_PROVIDERS = [
  { id: '1', name: 'DSTV', code: 'DSTV', icon: 'television-classic' as const },
  { id: '2', name: 'GOTV', code: 'GOTV', icon: 'television-classic' as const },
  { id: '3', name: 'Startimes', code: 'STARTIMES', icon: 'television-classic' as const },
];

// Mock data for subscription plans
const SUBSCRIPTION_PLANS = {
  DSTV: [
    { id: '1', name: 'Premium', days: 30, price: 24900 },
    { id: '2', name: 'Compact Plus', days: 30, price: 16600 },
    { id: '3', name: 'Compact', days: 30, price: 10600 },
    { id: '4', name: 'Confam', days: 30, price: 6100 },
    { id: '5', name: 'Yanga', days: 30, price: 4100 },
    { id: '6', name: 'Padi', days: 30, price: 2100 },
  ],
  GOTV: [
    { id: '1', name: 'Supa', days: 30, price: 5600 },
    { id: '2', name: 'Max', days: 30, price: 4600 },
    { id: '3', name: 'Jolli', days: 30, price: 2600 },
    { id: '4', name: 'Jinja', days: 30, price: 1600 },
  ],
  STARTIMES: [
    { id: '1', name: 'Nova', days: 30, price: 4600 },
    { id: '2', name: 'Basic', days: 30, price: 2600 },
    { id: '3', name: 'Smart', days: 30, price: 1600 },
  ],
};

// Mock customer data
const MOCK_CUSTOMERS = {
  '1234567890': { name: 'John Doe', status: 'active' },
  '9876543210': { name: 'Jane Smith', status: 'active' },
  '5555555555': { name: 'Michael Johnson', status: 'inactive' },
};

export default function TVSubscription() {
  const [selectedProvider, setSelectedProvider] = useState<typeof TV_PROVIDERS[0]>(TV_PROVIDERS[0]); // Default to DSTV
  const [smartCardNumber, setSmartCardNumber] = useState('');
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ id: string; name: string; days: number; price: number } | null>(null);
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'weekly' | 'monthly'>('monthly');
  const [customerName, setCustomerName] = useState<string | null>(null);
  const [isCardVerified, setIsCardVerified] = useState(false);

  // Handle smart card number change
  const handleSmartCardChange = (text: string) => {
    setSmartCardNumber(text);
    setIsCardVerified(false);
    setCustomerName(null);
  };

  const handleProceed = () => {
    if (smartCardNumber.length >= 10) {
      setShowLoading(true);
      // Simulate API call to verify card
      setTimeout(() => {
        // Check if card exists in mock data
        const customer = MOCK_CUSTOMERS[smartCardNumber as keyof typeof MOCK_CUSTOMERS];
        if (customer) {
          setCustomerName(customer.name);
          setIsCardVerified(true);
        } else {
          // For any other number, use a generic name
          setCustomerName('Customer');
          setIsCardVerified(true);
        }
        setShowLoading(false);
      }, 2000);
    }
  };

  const handlePurchase = () => {
    if (selectedPlan) {
      setShowLoading(true);
      // Simulate API call
      setTimeout(() => {
        setShowLoading(false);
        setShowSuccess(true);
        // Reset form
        setSmartCardNumber('4463527836');
        setSelectedProvider(TV_PROVIDERS[0]); // Reset to DSTV
        setSelectedPlan(null);
        setIsCardVerified(false);
        setCustomerName(null);
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
          {TV_PROVIDERS.map(provider => (
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

  const renderPlans = () => {
    if (!selectedProvider) return null;
    
    const plans = SUBSCRIPTION_PLANS[selectedProvider.code as keyof typeof SUBSCRIPTION_PLANS] || [];
    
    return (
      <View style={styles.plansContainer}>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            onPress={() => setSelectedTab('weekly')}
            style={[styles.tab, selectedTab === 'weekly' && styles.activeTab]}
          >
            <Text style={[styles.tabText, selectedTab === 'weekly' && styles.activeTabText]}>
              Weekly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setSelectedTab('monthly')}
            style={[styles.tab, selectedTab === 'monthly' && styles.activeTab]}
          >
            <Text style={[styles.tabText, selectedTab === 'monthly' && styles.activeTabText]}>
              Monthly
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.plansGrid}>
          {plans.map(plan => (
            <TouchableOpacity
              key={plan.id}
              onPress={() => isCardVerified && setSelectedPlan(plan)}
              style={[
                styles.planCard, 
                selectedPlan?.id === plan.id && styles.selectedPlanCard,
                !isCardVerified && styles.disabledPlanCard
              ]}
              disabled={!isCardVerified}
            >
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={styles.planDuration}>{plan.days} days</Text>
              <Text style={styles.planPrice}>₦{plan.price.toLocaleString()}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedPlan && isCardVerified && (
          <TouchableOpacity
            onPress={handlePurchase}
            style={styles.purchaseButton}
          >
            <Text style={styles.purchaseButtonText}>
              Purchase {selectedPlan.name} Plan
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

        {/* Smart Card Number */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Smart Card Number</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter smart card number"
              value={smartCardNumber}
              onChangeText={handleSmartCardChange}
              keyboardType="numeric"
              maxLength={10}
              style={styles.input}
            />
            {smartCardNumber.length >= 10 && (
              <TouchableOpacity
                onPress={handleProceed}
                style={styles.proceedButton}
              >
                <Text style={styles.proceedButtonText}>Verify</Text>
              </TouchableOpacity>
            )}
          </View>
          {customerName && (
            <View style={styles.customerInfo}>
              <Text style={styles.customerName}>Customer: {customerName}</Text>
            </View>
          )}
        </View>

        {/* Subscription Plans */}
        {selectedProvider && renderPlans()}
      </ScrollView>

      {/* Provider Selection Modal */}
      {showProviderModal && renderProviderModal()}

      {/* Loading Modal */}
      <Loader visible={showLoading} message="Processing your request..." />

      {/* Success Modal */}
      <SuccessModal 
        visible={showSuccess} 
        title="Success" 
        message="Your TV subscription has been processed successfully!" 
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
  placeholderText: {
    color: '#6B7280',
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
  proceedButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  proceedButtonText: {
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#E5E7EB',
  },
  activeTab: {
    backgroundColor: colors.primary.main,
  },
  tabText: {
    textAlign: 'center',
    fontWeight: '500',
    color: '#4B5563',
  },
  activeTabText: {
    color: 'white',
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
  planDuration: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary.main,
  },
  purchaseButton: {
    backgroundColor: colors.primary.main,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  purchaseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
