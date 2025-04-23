import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styled } from 'nativewind';
import { colors } from '@/constants/theme';
import { Loader } from '@/components/Loader';
import { SuccessModal } from '@/components/SuccessModal';
import { BankSelectionModal } from '@/components/BankSelectionModal';
import { AccountDetailsModal } from '@/components/AccountDetailsModal';
import { useRouter, useFocusEffect } from 'expo-router';
import { api } from '@/services/api';
import { ErrorModal } from '@/components/ErrorModal';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);
const StyledSafeAreaView = styled(SafeAreaView);

type TransferType = 'payflex' | 'other' | 'international';

interface Bank {
  id: string;
  code: string;
  name: string;
}

// Mock data for recent transfers
const mockTransfers = [
  {
    id: '1',
    amount: 5000,
    currency: 'NGN',
    beneficiary: {
      name: 'John Doe',
      accountNumber: '1234567890',
      bankName: 'Access Bank',
    },
    status: 'completed',
    date: '2024-03-15T10:30:00',
    reference: 'TRF202403151030',
  },
  {
    id: '2',
    amount: 10000,
    currency: 'NGN',
    beneficiary: {
      name: 'Jane Smith',
      accountNumber: '0987654321',
      bankName: 'GTBank',
    },
    status: 'completed',
    date: '2024-03-10T14:45:00',
    reference: 'TRF202403101445',
  },
  {
    id: '3',
    amount: 7500,
    currency: 'NGN',
    beneficiary: {
      name: 'Mike Johnson',
      accountNumber: '4567890123',
      bankName: 'Zenith Bank',
    },
    status: 'failed',
    date: '2024-03-05T09:15:00',
    reference: 'TRF202403050915',
  },
];

export default function Transfers() {
  const [showInitialModal, setShowInitialModal] = useState(true);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [transferType, setTransferType] = useState<TransferType>('payflex');
  const [showBankModal, setShowBankModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [amount, setAmount] = useState('');
  const [remark, setRemark] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [showAmountSection, setShowAmountSection] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  // Reset all form data when component unmounts
  useEffect(() => {
    return () => {
      resetForm();
    };
  }, []);

  // Reset form when page loses focus
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        resetForm();
      };
    }, [])
  );

  const resetForm = () => {
    setTransferType('payflex');
    setShowBankModal(false);
    setSelectedBank(null);
    setAccountNumber('');
    setAccountName('');
    setAmount('');
    setRemark('');
    setIsVerifying(false);
    setShowAccountDetails(false);
    setShowAmountSection(false);
    setIsTransferring(false);
    setShowSuccess(false);
  };

  const fetchAllBanks = async () => {
    try {
      setIsLoadingBanks(true);
      const response = await api.accounts.fetchBanks();
      setBanks(response);
    } catch (error) {
      console.error('Error fetching banks:', error);
    } finally {
      setIsLoadingBanks(false);
      console.log("All banks fetched...")
    }
  };

  const formatAmount = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    if (!numericValue) return '';
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(Number(numericValue));
  };

  const handleAccountNumberChange = async (account_number: string, bank_code: string) => {
    setAccountNumber(account_number);
    setAccountName(''); // Clear the name when editing
    
    if (account_number.length === 10 && bank_code) {
      setIsVerifying(true);
      try {
        const response = await api.banking.verifyAccountNumber(account_number, bank_code);
        console.log("response", response);
        setAccountName(response);
      } catch (error: any) {
        console.error("Error verifying account number:", error.message);
        setAccountName('Invalid account number');
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const handleNext = () => {
    if (accountName && accountNumber && selectedBank) {
      setShowAccountDetails(true);
    }
  };

  const handleConfirmAccount = () => {
    setShowAccountDetails(false);
    setShowAmountSection(true);
  };

  const handleTransfer = async () => {

    setIsTransferring(true);

    const payload = {
      amount: amount,
      account_number: accountNumber,
      beneficiary_name: accountName,
      bank_code: selectedBank?.code,
      narration: remark
    }

    console.log("payload", payload);

    try {
      const response = await api.banking.transfer(payload);
      console.log("response", response);
    } catch (error: any) {
      console.error("Error transferring funds:", error.message);
      setShowError(true);
      setErrorMessage(error.message);
    } finally {
      setIsTransferring(false);
    }
  };

  const handleRepeat = () => {
    setShowSuccess(false);
    // Reset form
    setAccountNumber('');
    setAccountName('');
    setAmount('');
    setRemark('');
    setSelectedBank(null);
  };

  const handleHome = () => {
    setShowSuccess(false);
    router.push('/(app)/home');
  };

  const handleTransferTypeSelection = (type: 'ngn' | 'international') => {
    setShowInitialModal(false);
    if (type === 'international') {
      setShowComingSoon(true);
      setTimeout(() => {
        setShowComingSoon(false);
        setShowInitialModal(true);
      }, 2000);
    }
  };

  const handleTransferTypeChange = (type: TransferType) => {
    setTransferType(type);
    if (type === 'other' && banks.length === 0) {
      fetchAllBanks();
    }
  };

  const handleBack = () => router.back();

  return (
    <StyledSafeAreaView className="flex-1 bg-gray-50">
      <StyledView className="px-4 py-4 flex-row items-center">
        <StyledTouchableOpacity
          className="mr-4"
          onPress={handleBack}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.primary.main} />
        </StyledTouchableOpacity>
        <StyledText className="text-2xl font-bold text-gray-900">Bank Transfer</StyledText>
      </StyledView>

      <ScrollView className="flex-1 px-4">
        {/* Transfer Type Selection */}
        <StyledView className="mb-6">
          <StyledText className="text-gray-600 mb-3">Select Transfer Type</StyledText>
          <StyledView className="flex-row space-x-4">
            <StyledTouchableOpacity
              className={`flex-1 p-4 rounded-xl ${transferType === 'payflex' ? 'bg-[#0066FF]' : 'bg-white'}`}
              onPress={() => handleTransferTypeChange('payflex')}
            >
              <StyledText className={`text-center font-medium ${transferType === 'payflex' ? 'text-white' : 'text-gray-900'}`}>
                Payflex
              </StyledText>
            </StyledTouchableOpacity>
            <StyledTouchableOpacity
              className={`flex-1 p-4 rounded-xl ${transferType === 'other' ? 'bg-[#0066FF]' : 'bg-white'}`}
              onPress={() => handleTransferTypeChange('other')}
            >
              <StyledText className={`text-center font-medium ${transferType === 'other' ? 'text-white' : 'text-gray-900'}`}>
                Other Banks
              </StyledText>
            </StyledTouchableOpacity>
            <StyledTouchableOpacity
              className={`flex-1 p-4 rounded-xl ${transferType === 'international' ? 'bg-[#0066FF]' : 'bg-white'}`}
              onPress={() => handleTransferTypeChange('international')}
            >
              <StyledText className={`text-center font-medium ${transferType === 'international' ? 'text-white' : 'text-gray-900'}`}>
                International
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>

        {transferType === 'international' ? (
          <StyledView className="items-center justify-center py-8">
            <MaterialCommunityIcons name="earth" size={48} color={colors.primary.main} />
            <StyledText className="text-gray-900 font-medium text-lg mt-4">International Transfers</StyledText>
            <StyledText className="text-gray-600 text-center mt-2">Coming soon! We're working on bringing international transfers to you.</StyledText>
          </StyledView>
        ) : (
          <>
            {/* Transfer Form */}
            {transferType === 'other' && !showAmountSection && (
              <StyledView>
                <StyledView className="flex-row items-center justify-between mb-4">
                  <StyledText className="text-gray-900 font-medium">Recipient Account</StyledText>
                  <StyledTouchableOpacity
                    className="p-2 rounded-full bg-gray-100"
                    onPress={() => setTransferType('payflex')}
                  >
                    <MaterialCommunityIcons name="arrow-left" size={20} color={colors.primary.main} />
                  </StyledTouchableOpacity>
                </StyledView>

                <StyledView className="bg-white rounded-xl p-4 mb-4">
                  {/* Bank Selection */}
                  <StyledView className="mb-4">
                    <StyledText className="text-gray-600 mb-2">Bank</StyledText>
                    <StyledTouchableOpacity
                      className="bg-gray-50 p-4 rounded-xl"
                      onPress={() => setShowBankModal(true)}
                    >
                      <StyledView className="flex-row justify-between items-center">
                        <StyledText className={selectedBank ? 'text-gray-900' : 'text-gray-400'}>
                          {selectedBank ? selectedBank.name : 'Select Bank'}
                        </StyledText>
                        <MaterialCommunityIcons name="chevron-down" size={24} color={colors.primary.main} />
                      </StyledView>
                    </StyledTouchableOpacity>
                  </StyledView>

                  <StyledView className="h-[1px] bg-gray-100 my-4" />

                  {/* Account Number */}
                  <StyledView>
                    <StyledText className="text-gray-600 mb-2">Account Number</StyledText>
                    <StyledTextInput
                      className="bg-gray-50 p-4 rounded-xl text-lg"
                      placeholder="Enter account number"
                      keyboardType="numeric"
                      maxLength={10}
                      value={accountNumber}
                      onChangeText={(text) => {
                        setAccountNumber(text);
                        if (text.length === 10 && selectedBank?.code) {
                          handleAccountNumberChange(text, selectedBank.code);
                        }
                      }}
                      editable={!!selectedBank}
                    />
                    {isVerifying && (
                      <StyledView className="flex-row items-center mt-2">
                        <MaterialCommunityIcons name="loading" size={20} color={colors.primary.main} />
                        <StyledText className="text-gray-600 ml-2">Verifying account...</StyledText>
                      </StyledView>
                    )}
                    {accountName && !isVerifying && (
                      <StyledText 
                        className={`text-right mt-2 ${
                          accountName === 'Invalid account number' ? 'text-red-500 text-base' : 'text-primary-main text-lg font-semibold'
                        }`}
                      >
                        {accountName}
                      </StyledText>
                    )}
                  </StyledView>
                </StyledView>

                {accountName && (
                  <StyledTouchableOpacity
                    className="py-4 rounded-xl bg-[#0066FF]"
                    onPress={handleNext}
                  >
                    <StyledText className="text-white text-center font-semibold">Next</StyledText>
                  </StyledTouchableOpacity>
                )}
              </StyledView>
            )}

            {transferType === 'other' && showAmountSection && (
              <StyledView>
                <StyledView className="flex-row items-center justify-between mb-4">
                  <StyledText className="text-gray-900 font-medium">Transfer Details</StyledText>
                  <StyledTouchableOpacity
                    className="p-2 rounded-full bg-gray-100"
                    onPress={() => {
                      setShowAmountSection(false);
                      setShowAccountDetails(false);
                    }}
                  >
                    <MaterialCommunityIcons name="arrow-left" size={20} color={colors.primary.main} />
                  </StyledTouchableOpacity>
                </StyledView>

                {/* Account Summary */}
                <StyledView className="bg-white rounded-xl p-4 mb-6">
                  <StyledView className="flex-row justify-between items-center mb-3">
                    <StyledText className="text-gray-500">Account Name</StyledText>
                    <StyledText className="text-gray-900 font-medium">{accountName}</StyledText>
                  </StyledView>
                  <StyledView className="h-[1px] bg-gray-100 my-2" />
                  <StyledView className="flex-row justify-between items-center mb-3">
                    <StyledText className="text-gray-500">Account Number</StyledText>
                    <StyledText className="text-gray-900 font-medium">{accountNumber}</StyledText>
                  </StyledView>
                  <StyledView className="h-[1px] bg-gray-100 my-2" />
                  <StyledView className="flex-row justify-between items-center">
                    <StyledText className="text-gray-500">Bank</StyledText>
                    <StyledText className="text-gray-900 font-medium">{selectedBank?.name}</StyledText>
                  </StyledView>
                </StyledView>

                {/* Amount */}
                <StyledView className="bg-white rounded-xl p-4 mb-4">
                  <StyledText className="text-gray-600 mb-2">Amount</StyledText>
                  <StyledView className="flex-row items-center bg-gray-50 p-4 rounded-xl">
                    <StyledText className="text-gray-900 mr-2">₦</StyledText>
                    <StyledTextInput
                      className="flex-1 text-lg"
                      placeholder="Enter amount"
                      keyboardType="numeric"
                      value={amount}
                      onChangeText={(text) => setAmount(formatAmount(text))}
                    />
                  </StyledView>
                </StyledView>

                {/* Remark */}
                <StyledView className="bg-white rounded-xl p-4 mb-6">
                  <StyledText className="text-gray-600 mb-2">Remark (Optional)</StyledText>
                  <StyledTextInput
                    className="bg-gray-50 p-4 rounded-xl text-lg"
                    placeholder="Enter remark"
                    value={remark}
                    onChangeText={setRemark}
                  />
                </StyledView>

                <StyledTouchableOpacity
                  className={`py-4 rounded-xl ${amount ? 'bg-[#0066FF]' : 'bg-gray-200'}`}
                  onPress={handleTransfer}
                  disabled={!amount}
                >
                  <StyledText className={`text-center font-semibold ${amount ? 'text-white' : 'text-gray-400'}`}>
                    Send
                  </StyledText>
                </StyledTouchableOpacity>
              </StyledView>
            )}

            {transferType === 'payflex' && (
              <StyledView>
                <StyledView className="flex-row items-center justify-between mb-4">
                  <StyledText className="text-gray-900 font-medium">Recipient Details</StyledText>
                  <StyledTouchableOpacity
                    className="p-2 rounded-full bg-gray-100"
                    onPress={() => setTransferType('other')}
                  >
                    <MaterialCommunityIcons name="arrow-left" size={20} color={colors.primary.main} />
                  </StyledTouchableOpacity>
                </StyledView>

                <StyledView className="bg-white rounded-xl p-4 mb-4">
                  <StyledView className="mb-4">
                    <StyledText className="text-gray-600 mb-2">To:</StyledText>
                    <StyledTextInput
                      className="bg-gray-50 p-4 rounded-xl text-lg"
                      placeholder="Enter account number"
                      keyboardType="numeric"
                      maxLength={10}
                      value={accountNumber}
                      onChangeText={(text) => {
                        setAccountNumber(text);
                        if (text.length === 10 && selectedBank?.code) {
                          handleAccountNumberChange(text, selectedBank.code);
                        }
                      }}
                    />
                    {isVerifying && (
                      <StyledView className="flex-row items-center mt-2">
                        <MaterialCommunityIcons name="loading" size={20} color={colors.primary.main} />
                        <StyledText className="text-gray-600 ml-2">Verifying account...</StyledText>
                      </StyledView>
                    )}
                    {accountName && !isVerifying && (
                      <StyledText className="text-right text-primary-main font-semibold text-lg mt-2">
                        {accountName}
                      </StyledText>
                    )}
                  </StyledView>

                  <StyledView className="h-[1px] bg-gray-100 my-4" />

                  <StyledView className="mb-4">
                    <StyledText className="text-gray-600 mb-2">Amount:</StyledText>
                    <StyledTextInput
                      className="bg-gray-50 p-4 rounded-xl text-lg"
                      placeholder="Enter amount"
                      keyboardType="numeric"
                      value={amount}
                      onChangeText={(text) => setAmount(formatAmount(text))}
                    />
                  </StyledView>
                </StyledView>

                <StyledTouchableOpacity
                  className={`py-4 rounded-xl ${accountName && amount ? 'bg-[#0066FF]' : 'bg-gray-200'}`}
                  onPress={handleTransfer}
                  disabled={!accountName || !amount}
                >
                  <StyledText className={`text-center font-semibold ${accountName && amount ? 'text-white' : 'text-gray-400'}`}>
                    Transfer
                  </StyledText>
                </StyledTouchableOpacity>
              </StyledView>
            )}
          </>
        )}
      </ScrollView>

      <BankSelectionModal
        visible={showBankModal}
        banks={banks}
        selectedBank={selectedBank}
        onSelect={(bank) => {
          setSelectedBank(bank);
          setShowBankModal(false);
        }}
        onClose={() => setShowBankModal(false)}
      />

      <AccountDetailsModal
        visible={showAccountDetails}
        accountName={accountName}
        accountNumber={accountNumber}
        bankName={selectedBank?.name || ''}
        onConfirm={handleConfirmAccount}
        onClose={() => setShowAccountDetails(false)}
      />

      <Loader visible={isTransferring} message="Processing Transfer..." />
      <Loader visible={isLoadingBanks} message="Fetching Banks..." />
      <SuccessModal
        visible={showSuccess}
        title="Transfer Successful"
        message="Your transfer has been processed successfully"
        onClose={() => setShowSuccess(false)}
        autoClose={false}
        buttons={[
          {
            text: 'Repeat',
            onPress: handleRepeat,
            style: 'primary'
          },
          {
            text: 'Home',
            onPress: handleHome,
            style: 'secondary'
          }
        ]}
      />

      <ErrorModal
        visible={showError}
        message={errorMessage}
        onClose={() => setShowError(false)}
      />
    </StyledSafeAreaView>
  );
}