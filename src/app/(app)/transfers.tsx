import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { Loader } from '@/components/Loader';

// Nigerian banks data
const NIGERIAN_BANKS = [
  { code: '044', name: 'Access Bank' },
  { code: '063', name: 'Access Bank (Diamond)' },
  { code: '050', name: 'Ecobank Nigeria' },
  { code: '070', name: 'Fidelity Bank' },
  { code: '011', name: 'First Bank of Nigeria' },
  { code: '214', name: 'First City Monument Bank' },
  { code: '058', name: 'Guaranty Trust Bank' },
  { code: '030', name: 'Heritage Bank' },
  { code: '082', name: 'Keystone Bank' },
  { code: '076', name: 'Polaris Bank' },
  { code: '221', name: 'Stanbic IBTC Bank' },
  { code: '068', name: 'Standard Chartered Bank' },
  { code: '232', name: 'Sterling Bank' },
  { code: '100', name: 'Suntrust Bank' },
  { code: '032', name: 'Union Bank of Nigeria' },
  { code: '033', name: 'United Bank for Africa' },
  { code: '215', name: 'Unity Bank' },
  { code: '035', name: 'Wema Bank' },
  { code: '057', name: 'Zenith Bank' },
];

type TransferType = 'ngn-ngn' | 'ngn-others';

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
  const [showTransferTypeModal, setShowTransferTypeModal] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showBankList, setShowBankList] = useState(false);
  const [selectedBank, setSelectedBank] = useState<{ code: string; name: string } | null>(null);
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleBankSelection = (bank: { code: string; name: string }) => {
    console.log('Bank selected:', bank.name);
    setSelectedBank(bank);
    setShowBankList(false);
    if (accountNumber.length === 10) {
      console.log('Account number is 10 digits, triggering verification with bank:', bank);
      setIsVerifying(true);
      setTimeout(() => {
        setAccountName('Mayowa Bernard Oluwaremi');
        setIsVerifying(false);
      }, 2500);
    } else {
      console.log('Account number not 10 digits yet:', accountNumber.length);
    }
  };

  const verifyAccount = () => {
    console.log('Verifying account:', { accountNumber, selectedBank });
    if (accountNumber.length === 10 && selectedBank) {
      console.log('Starting verification...');
      setIsVerifying(true);
      // Simulate API call to verify account
      setTimeout(() => {
        setAccountName('Mayowa Bernard Oluwaremi');
        setIsVerifying(false);
        console.log('Verification complete');
      }, 2500);
    } else {
      console.log('Verification conditions not met:', {
        accountNumberLength: accountNumber.length,
        hasSelectedBank: !!selectedBank
      });
    }
  };

  const handleTransfer = () => {
    // Show loading overlay immediately
    setShowLoading(true);
    
    // Close the transfer form
    setShowTransferForm(false);
    
    // Simulate API call with a delay
    setTimeout(() => {
      // Hide loading overlay
      setShowLoading(false);
      // Show success modal
      setShowSuccessModal(true);
      // Reset form
      setAccountNumber('');
      setAccountName('');
      setSelectedBank(null);
    }, 2000);
  };

  const renderTransferTypeModal = () => (
    <Modal
      visible={showTransferTypeModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowTransferTypeModal(false)}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 16,
            padding: 24,
          }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}>
              <TouchableOpacity onPress={() => setShowTransferTypeModal(false)}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
              </TouchableOpacity>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>
                Select Transfer Type
              </Text>
              <TouchableOpacity 
                onPress={() => setShowTransferTypeModal(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#EF4444',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialCommunityIcons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                backgroundColor: '#F3F4F6',
                borderRadius: 12,
                marginBottom: 16,
              }}
              onPress={() => {
                setShowTransferTypeModal(false);
                setShowTransferForm(true);
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                  NGN to NGN Transfer
                </Text>
                <Text style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>
                  Transfer within Nigeria
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#6B7280" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                backgroundColor: '#F3F4F6',
                borderRadius: 12,
              }}
              onPress={() => {
                setShowTransferTypeModal(false);
                Alert.alert('Coming Soon', 'International transfers will be available soon');
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                  NGN to Others
                </Text>
                <Text style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>
                  International transfers
                </Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderBankListModal = () => {
    if (!showBankList) return null;

    return (
      <View style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
      }}>
        <View style={{ 
          backgroundColor: 'white', 
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          padding: 20,
          maxHeight: '80%',
        }}>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#111827' }}>
              Select Bank
            </Text>
            <TouchableOpacity onPress={() => setShowBankList(false)}>
              <MaterialCommunityIcons name="close" size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {NIGERIAN_BANKS.map(bank => (
              <TouchableOpacity
                key={bank.code}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: '#E5E7EB',
                }}
                onPress={() => handleBankSelection(bank)}
              >
                <Text style={{ fontSize: 16, color: '#111827' }}>{bank.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderTransferForm = () => (
    <Modal
      visible={showTransferForm}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowTransferForm(false)}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 16,
            padding: 24,
          }}>
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 24,
            }}>
              <TouchableOpacity 
                onPress={() => {
                  setShowTransferForm(false);
                  setShowTransferTypeModal(true);
                }}
                style={{ marginRight: 16 }}
              >
                <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
              </TouchableOpacity>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>
                NGN to NGN Transfer
              </Text>
              <TouchableOpacity 
                onPress={() => setShowTransferForm(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#EF4444',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialCommunityIcons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 4 }}>Account Number</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 8,
                  padding: 12,
                  fontSize: 16,
                }}
                placeholder="Enter account number"
                keyboardType="numeric"
                maxLength={10}
                value={accountNumber}
                onChangeText={(text) => {
                  setAccountNumber(text);
                  if (text.length === 10 && selectedBank) {
                    verifyAccount();
                  }
                }}
              />
            </View>

            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 4 }}>Select Bank</Text>
              <TouchableOpacity
                style={{
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                  borderRadius: 8,
                  padding: 12,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onPress={() => setShowBankList(true)}
              >
                <Text style={{ color: selectedBank ? '#111827' : '#9CA3AF', fontSize: 16 }}>
                  {selectedBank ? selectedBank.name : 'Select bank'}
                </Text>
                <MaterialCommunityIcons name="chevron-down" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {isVerifying && (
              <View style={{ marginBottom: 16, flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="loading" size={20} color={colors.primary.main} />
                <Text style={{ marginLeft: 8, color: '#6B7280', fontSize: 14 }}>
                  Verifying account...
                </Text>
              </View>
            )}

            {accountName && !isVerifying && (
              <View style={{ marginBottom: 16 }}>
                <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 4 }}>Account Name</Text>
                <Text style={{ fontSize: 16, color: '#111827' }}>{accountName}</Text>
              </View>
            )}

            <TouchableOpacity
              style={{
                backgroundColor: colors.primary.main,
                padding: 16,
                borderRadius: 12,
                alignItems: 'center',
                opacity: accountName && selectedBank ? 1 : 0.5,
              }}
              disabled={!accountName || !selectedBank}
              onPress={handleTransfer}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
      {renderBankListModal()}
    </Modal>
  );

  const renderSuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowSuccessModal(false)}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 16,
            padding: 32,
            alignItems: 'center',
            width: '100%',
          }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              marginBottom: 24,
            }}>
              <View style={{ width: 24 }} />
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>
                Transfer Successful
              </Text>
              <TouchableOpacity 
                onPress={() => setShowSuccessModal(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#EF4444',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialCommunityIcons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={{ color: '#6B7280', fontSize: 16, textAlign: 'center', marginBottom: 24 }}>
              Your transfer has been processed successfully
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: colors.primary.main,
                padding: 16,
                borderRadius: 12,
                width: '100%',
                alignItems: 'center',
              }}
              onPress={() => {
                setShowSuccessModal(false);
                setAccountNumber('');
                setAccountName('');
                setSelectedBank(null);
              }}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderRecentTransfers = () => (
    <View style={{ marginTop: 24 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 16 }}>
        Recent Transfers
      </Text>
      {mockTransfers.map(transfer => (
        <View
          key={transfer.id}
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                {transfer.beneficiary.name}
              </Text>
              <Text style={{ color: '#6B7280', fontSize: 14, marginTop: 4 }}>
                {transfer.beneficiary.accountNumber} • {transfer.beneficiary.bankName}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>
                {transfer.currency} {transfer.amount.toLocaleString()}
              </Text>
              <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 4 }}>
                {new Date(transfer.date).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: '#E5E7EB',
          }}>
            <Text style={{ color: '#6B7280', fontSize: 12 }}>
              Ref: {transfer.reference}
            </Text>
            <View style={{ 
              backgroundColor: transfer.status === 'completed' ? '#D1FAE5' : 
                            transfer.status === 'failed' ? '#FEE2E2' : '#FEF3C7',
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
            }}>
              <Text style={{ 
                color: transfer.status === 'completed' ? '#065F46' : 
                      transfer.status === 'failed' ? '#B91C1C' : '#92400E',
                fontSize: 12,
                textTransform: 'capitalize',
              }}>
                {transfer.status}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>Transfers</Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.primary.main,
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 12,
            marginBottom: 24,
          }}
          onPress={() => setShowTransferTypeModal(true)}
        >
          <MaterialCommunityIcons name="plus" size={20} color="white" />
          <Text style={{ marginLeft: 8, color: 'white', fontSize: 14, fontWeight: '500' }}>
            New Transfer
          </Text>
        </TouchableOpacity>

        {renderRecentTransfers()}
      </ScrollView>

      {renderTransferTypeModal()}
      {renderTransferForm()}
      {renderSuccessModal()}
      <Loader visible={showLoading} message="Processing transfer..." />
    </SafeAreaView>
  );
}