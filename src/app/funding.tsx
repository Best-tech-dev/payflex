import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { colors } from '@/constants/theme';
import { Loader } from '@/components/Loader';
import { SuccessModal } from '@/components/SuccessModal';
import { api } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);
const StyledSafeAreaView = styled(SafeAreaView);

const accountDetails = {
  accountNumber: '0123456789',
  accountName: 'John Doe',
};

export default function Funding() {
  const router = useRouter();
  const [showAmountModal, setShowAmountModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Format amount with currency symbol and commas
  // Helper function to parse amount without currency symbol and commas
  const parseAmount = (value: string): string => {
    return value.replace(/[^0-9]/g, '');
  };

  const formatAmount = (value: string) => {
    const numericValue = parseAmount(value);
    if (!numericValue) return '';
    const formatted = new Intl.NumberFormat('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(numericValue));
    return `₦${formatted}`;
  }
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // New states for the generated account details
  const [generatedAccount, setGeneratedAccount] = useState<{
    amount: string;
    accountNumber: string;
    bank: string;
    expiresIn: number; // in seconds
  } | null>(null);

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Handle countdown timer
  useEffect(() => {
    if (generatedAccount && generatedAccount.expiresIn > 0) {
      setCountdown(generatedAccount.expiresIn);
      const interval = setInterval(() => {
        setCountdown((prev) => (prev && prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [generatedAccount]);

  const handleBack = () => router.back();

  // API call to generate one-time account
  // In Funding.tsx, find the handleGenerateAccount function and replace it with:
const handleGenerateAccount = async () => {
  const numericAmount = parseAmount(amount);
  const parsedAmount = parseFloat(numericAmount);
  if (!numericAmount || isNaN(parsedAmount)) {
    Alert.alert('Invalid Amount', 'Please enter a valid amount');
    return;
  }
  setLoading(true);
  try {
    const response = await api.wallet.generateOneTimeAccount(parsedAmount);
    if (response) {
      setIsGenerating(true);
      
      // New code here to handle the amount correctly
      const apiAmount = response.amount ? parseFloat(response.amount) : parsedAmount;
      
      setGeneratedAccount({
        amount: apiAmount.toString(), // Store the parsed amount as string
        accountNumber: response.account_number, // Use account_number from API response
        bank: response.bank_name, // Use bank_name from API response
        expiresIn: 1800, // 30 minutes in seconds
      });
      setShowAccountModal(true);
      // Reset the amount field after successful generation
      setAmount('');
    }
  } catch (error) {
    console.error('Error generating account:', error);
    Alert.alert('Error', 'Failed to generate account');
  } finally {
    setLoading(false);
  }
};

  // API call to verify payment
  const handleVerifyPayment = async () => {
    setLoading(true);
    try {
      const response = await api.wallet.verifyPayment();
      if (response.success) {
        setShowSuccess(true);
        setGeneratedAccount(null); // Clear the generated account details
      } else {
        Alert.alert('Payment Verification Failed', response.message || 'Please try again.');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      Alert.alert('Error', 'Failed to verify payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format countdown timer
  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleFundWallet = async () => {
    if (!amount) return;
    
    setShowAmountModal(false);
    setLoading(true);
  
    try {
      // Input validation
      const numericAmount = parseAmount(amount);
      const amountValue = parseFloat(numericAmount);
      if (!numericAmount || isNaN(amountValue) || amountValue <= 0) {
        throw new Error('Please enter a valid amount');
      }
  
      // Call API with error handling
      const response = await api.wallet.fundWallet(amountValue, "http://localhost:1000/api/v1").catch(error => {
        console.error('API Error:', error);
        throw new Error(error.message || 'Network error. Please check your connection and try again.');
      });
      
      // Validate response
      if (!response || !response.authorization_url) {
        throw new Error('Invalid payment response from server');
      }
      
      // Store payment reference for later verification
      await AsyncStorage.setItem('pendingPaymentRef', response.reference);
      
      // Navigate to payment webview
      router.push({
        pathname: '/payment-webview',
        params: { 
          url: response.authorization_url,
          reference: response.reference,
          amount: response.amount
        }
      });
    } catch (error: unknown) {
      // Enhanced error handling with specific error messages
      const errorMessage = error instanceof Error ? error.message : 'Unable to process payment at this time';
      
      console.error('Payment initialization failed:', error);
      
      Alert.alert(
        'Payment Failed', 
        errorMessage,
        [
          { 
            text: 'Try Again', 
            onPress: () => setShowAmountModal(true), 
            style: 'default' 
          },
          { 
            text: 'Cancel', 
            style: 'cancel' 
          }
        ]
      );
      
      // Log error for analytics
      // logErrorToAnalytics('payment_initialization_failed', { error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    router.replace('/(app)/home');
  };

  const FundingOption = ({ 
    title, 
    icon, 
    disabled,
    onPress 
  }: { 
    title: string;
    icon: string;
    disabled?: boolean;
    onPress?: () => void;
  }) => (
    <StyledTouchableOpacity
      onPress={disabled ? undefined : onPress}
      className={`flex-1 p-4 rounded-xl mr-2 ${disabled ? 'bg-gray-100' : 'bg-white shadow-sm'}`}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <MaterialCommunityIcons
        name={icon as any}
        size={24}
        color={disabled ? '#9CA3AF' : colors.primary.main}
        style={{ marginBottom: 16 }}
      />
      <StyledText 
        className={`${disabled ? 'text-gray-400' : 'text-gray-900'} font-medium`}
      >
        {title}
      </StyledText>
    </StyledTouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StyledSafeAreaView className="flex-1 bg-gray-50">
        {/* Header */}
        <StyledView className="flex-row items-center justify-between px-4 py-4">
          <StyledTouchableOpacity onPress={handleBack}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
          </StyledTouchableOpacity>
          <StyledText className="text-xl font-semibold text-gray-900">Fund Wallet</StyledText>
          <StyledView style={{ width: 24 }} />
        </StyledView>

        {/* Funding Options */}
        <StyledView className="flex-row px-4 mb-4 mt-10">
          <FundingOption
            title="Card / USSD"
            icon="credit-card-outline"
            onPress={() => setShowAmountModal(true)}
          />
          <FundingOption
            title="Payflex Tag"
            icon="tag-outline"
            disabled
          />
        </StyledView>

        <StyledView className="px-4">
        <StyledText className="text-gray-600 mb-4 text-sm">
            If you are paying with user tag, kindly share your tag with another Payflex user to instantly receive funds in your NGN account
          </StyledText>

          <StyledView className="flex-row items-center mb-4">
            <StyledView className="flex-1 h-[1px] bg-gray-200" />
            <StyledText className="mx-4 text-gray-500">or</StyledText>
            <StyledView className="flex-1 h-[1px] bg-gray-200" />
          </StyledView>

          <StyledTouchableOpacity
            className="py-4 rounded-xl bg-[#0066FF]"
            onPress={() => router.push('/(app)/accounts')}
          >
            <StyledText className="text-white text-center font-semibold">Bank Transfer</StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        {/* Amount Input Modal */}
        <Modal
          visible={showAmountModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAmountModal(false)}
        >
          <StyledView className="flex-1 bg-black/50 justify-center items-center px-4">
            <StyledView className="bg-white rounded-2xl p-6 w-full max-w-sm">
              <StyledView className="flex-row justify-between items-center mb-6">
                <StyledText className="text-xl font-semibold text-gray-900">
                  Enter Amount
                </StyledText>
                <StyledTouchableOpacity onPress={() => setShowAmountModal(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#111827" />
                </StyledTouchableOpacity>
              </StyledView>
              <StyledTextInput
                className="bg-gray-50 p-4 rounded-xl text-lg mb-6"
                placeholder="Enter amount"
                keyboardType="numeric"
                value={amount}
                onChangeText={(text) => setAmount(formatAmount(text))}
              />
              <StyledTouchableOpacity
                className={`py-4 rounded-xl ${amount ? 'bg-[#0066FF]' : 'bg-blue-300'}`}
                onPress={handleFundWallet}
                disabled={!amount}
              >
                <StyledText className="text-white text-center font-semibold">
                  Proceed to fund wallet
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        </Modal>

        {/* Loader */}
        <Loader visible={loading} message="Processing your request..." />

        {/* Success Modal */}
        <SuccessModal
          visible={showSuccess}
          title="Payment Verified"
          message="Your payment has been successfully verified and your wallet has been funded."
          onClose={() => setShowSuccess(false)}
          buttons={[{
            text: "Home",
            onPress: () => router.replace('/(app)/home'),
            style: 'primary'
          }]}
        />
      </StyledSafeAreaView>
    </>
  );
}


