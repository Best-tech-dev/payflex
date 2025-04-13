import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { colors } from '@/constants/theme';
import { Loader } from '@/components/Loader';
import { SuccessModal } from '@/components/SuccessModal';

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
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleBack = () => router.back();

  const handleFundWallet = async () => {
    if (!amount) return;
    
    setShowAmountModal(false);
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setShowSuccess(true);
      setAmount('');
    }, 2000);
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
        style={{ marginBottom: 8 }}
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

        {/* Account Details */}
        <StyledView className="m-4 p-6 bg-white rounded-xl opacity-50">
          <StyledText className="text-gray-600 mb-2">Payflex Account Number</StyledText>
          <StyledText className="text-2xl font-semibold text-gray-900 mb-1">
            {accountDetails.accountNumber}
          </StyledText>
          <StyledText className="text-gray-600">{accountDetails.accountName}</StyledText>
        </StyledView>

        {/* Divider */}
        <StyledView className="flex-row items-center px-4 my-4">
          <StyledView className="flex-1 h-[1px] bg-gray-200" />
          <StyledText className="mx-4 text-gray-500">or</StyledText>
          <StyledView className="flex-1 h-[1px] bg-gray-200" />
        </StyledView>

        {/* Funding Options */}
        <StyledView className="flex-row px-4">
          <FundingOption
            title="Card/Bank"
            icon="credit-card-outline"
            onPress={() => setShowAmountModal(true)}
          />
          <FundingOption
            title="Payflex Tag"
            icon="tag-outline"
            disabled
          />
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
                onChangeText={setAmount}
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
          title="Funding Successful"
          message="Your account has been successfully funded"
          onClose={() => setShowSuccess(false)}
          buttonText="Home"
          onButtonPress={handleGoHome}
        />
      </StyledSafeAreaView>
    </>
  );
}



