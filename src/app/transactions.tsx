import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import { styled } from 'nativewind';
import { useRouter, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';

// Styled components for NativeWind
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

// Mock transaction data
const mockTransactions = [
  {
    id: '1',
    title: 'Airtime Purchase',
    description: 'MTN Airtime Top-up',
    amount: 5000,
    type: 'debit',
    status: 'successful',
    date: '2025-04-13',
    image: 'https://via.placeholder.com/40',
    bankIcon: 'https://via.placeholder.com/40',
    bankName: 'First Bank',
    accountName: 'John Doe',
    accountNumber: '0123456789',
    fee: 100,
    transactionNo: 'TRX123456789',
    remark: 'Airtime purchase for 08012345678',
    transactionType: 'Airtime Purchase',
  },
  {
    id: '2',
    title: 'Money Transfer',
    description: 'Transfer to John Doe',
    amount: 15000,
    type: 'debit',
    status: 'pending',
    date: '2025-04-12',
    image: 'https://via.placeholder.com/40',
    bankIcon: 'https://via.placeholder.com/40',
    bankName: 'GTBank',
    accountName: 'Jane Smith',
    accountNumber: '9876543210',
    fee: 100,
    transactionNo: 'TRX987654321',
    remark: 'Monthly allowance',
    transactionType: 'Bank Transfer',
  },
  {
    id: '3',
    title: 'Wallet Funding',
    description: 'Bank Transfer',
    amount: 50000,
    type: 'credit',
    status: 'successful',
    date: '2025-04-11',
    image: 'https://via.placeholder.com/40',
    bankIcon: 'https://via.placeholder.com/40',
    bankName: 'Access Bank',
    accountName: 'Robert Johnson',
    accountNumber: '5555666677',
    fee: 100,
    transactionNo: 'TRX555666777',
    remark: 'Wallet funding',
    transactionType: 'Bank Transfer',
  },
];

const categories = ['All Categories', 'Airtime', 'Data', 'Transfers', 'Bills', 'Funding'];
const statuses = ['All Status', 'Successful', 'Pending', 'Failed'];

export default function Transactions() {
  // Hide default header
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TransactionsContent />
    </>
  );
}

function TransactionsContent() {
  const router = useRouter();
  const [showCategories, setShowCategories] = useState(false);
  const [showStatuses, setShowStatuses] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedTransaction, setSelectedTransaction] = useState<typeof mockTransactions[0] | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  const handleBack = () => router.back();
  const handleDownload = () => {
    // Implement download functionality
    console.log('Download transactions');
  };

  const FilterButton = ({ 
    label, 
    onPress, 
    isOpen 
  }: { 
    label: string; 
    onPress: () => void; 
    isOpen: boolean;
  }) => (
    <StyledTouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between px-4 py-2 bg-gray-100 rounded-lg"
    >
      <StyledText className="text-gray-800 font-medium">{label}</StyledText>
      <MaterialCommunityIcons
        name={isOpen ? 'chevron-up' : 'chevron-down'}
        size={20}
        color="#374151"
      />
    </StyledTouchableOpacity>
  );

  const FilterModal = ({
    visible,
    onClose,
    options,
    selected,
    onSelect,
  }: {
    visible: boolean;
    onClose: () => void;
    options: string[];
    selected: string;
    onSelect: (option: string) => void;
  }) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <StyledTouchableOpacity
        className="flex-1 bg-black/50"
        onPress={onClose}
        activeOpacity={1}
      >
        <StyledView className="bg-white rounded-t-3xl mt-auto">
          <StyledView className="p-4">
            {options.map((option) => (
              <StyledTouchableOpacity
                key={option}
                onPress={() => {
                  onSelect(option);
                  onClose();
                }}
                className={`py-4 px-6 ${
                  selected === option ? 'bg-gray-100' : ''
                }`}
              >
                <StyledText
                  className={`text-base ${
                    selected === option ? 'text-primary-600 font-medium' : 'text-gray-800'
                  }`}
                >
                  {option}
                </StyledText>
              </StyledTouchableOpacity>
            ))}
          </StyledView>
        </StyledView>
      </StyledTouchableOpacity>
    </Modal>
  );

  const TransactionCard = ({ transaction }: { transaction: typeof mockTransactions[0] }) => (
    <StyledTouchableOpacity
      className="flex-row items-center bg-white p-4 rounded-xl mb-3 shadow-sm"
      onPress={() => {
        setSelectedTransaction(transaction);
        setShowTransactionDetails(true);
      }}
    >
      <StyledImage
        source={{ uri: transaction.image }}
        className="w-10 h-10 rounded-full"
      />
      <StyledView className="flex-1 ml-3">
        <StyledText className="text-gray-900 font-medium">{transaction.title}</StyledText>
        <StyledText className="text-gray-500 text-sm">{transaction.date}</StyledText>
      </StyledView>
      <StyledView className="items-end">
        <StyledText
          className={`font-medium ${
            transaction.type === 'credit' ? 'text-green-600' : 'text-gray-900'
          }`}
        >
          {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
        </StyledText>
        <StyledView
          className={`px-2 py-1 rounded-full mt-1 ${
            transaction.status === 'successful'
              ? 'bg-green-100'
              : transaction.status === 'pending'
              ? 'bg-yellow-100'
              : 'bg-red-100'
          }`}
        >
          <StyledText
            className={`text-xs capitalize ${
              transaction.status === 'successful'
                ? 'text-green-700'
                : transaction.status === 'pending'
                ? 'text-yellow-700'
                : 'text-red-700'
            }`}
          >
            {transaction.status}
          </StyledText>
        </StyledView>
      </StyledView>
    </StyledTouchableOpacity>
  );

  return (
    <StyledSafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <StyledView className="flex-row items-center justify-between px-4 py-4">
        <StyledTouchableOpacity onPress={handleBack}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
        </StyledTouchableOpacity>
        <StyledText className="text-xl font-semibold text-gray-900">Transactions</StyledText>
        <StyledTouchableOpacity onPress={handleDownload}>
          <MaterialCommunityIcons name="download" size={24} color="#111827" />
        </StyledTouchableOpacity>
      </StyledView>

      {/* Filters */}
      <StyledView className="flex-row justify-between px-4 py-4 space-x-3">
        <StyledView className="flex-1">
          <FilterButton
            label={selectedCategory}
            onPress={() => setShowCategories(true)}
            isOpen={showCategories}
          />
        </StyledView>
        <StyledView className="flex-1">
          <FilterButton
            label={selectedStatus}
            onPress={() => setShowStatuses(true)}
            isOpen={showStatuses}
          />
        </StyledView>
      </StyledView>

      {/* Transaction List */}
      <StyledScrollView className="flex-1 px-4">
        {mockTransactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
      </StyledScrollView>

      {/* Filter Modals */}
      <FilterModal
        visible={showCategories}
        onClose={() => setShowCategories(false)}
        options={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <FilterModal
        visible={showStatuses}
        onClose={() => setShowStatuses(false)}
        options={statuses}
        selected={selectedStatus}
        onSelect={setSelectedStatus}
      />

      {/* Transaction Details Modal */}
      <Modal
        visible={showTransactionDetails}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTransactionDetails(false)}
      >
        <StyledTouchableOpacity
          className="flex-1 bg-black/50"
          activeOpacity={1}
          onPress={() => setShowTransactionDetails(false)}
        >
          <StyledView className="bg-white rounded-t-3xl mt-auto p-4">
            {selectedTransaction && (
              <>
                {/* Header */}
                <StyledView className="flex-row items-center justify-between mb-6">
                  <StyledTouchableOpacity
                    onPress={() => setShowTransactionDetails(false)}
                  >
                    <MaterialCommunityIcons name="close" size={24} color="#111827" />
                  </StyledTouchableOpacity>
                  <StyledText className="text-lg font-semibold">Transaction Details</StyledText>
                  <StyledView style={{ width: 24 }} />
                </StyledView>

                {/* Bank/Transaction Info */}
                <StyledView className="mb-6">
                  <StyledView className="flex-row items-center mb-4">
                    <StyledImage
                      source={{ uri: selectedTransaction.bankIcon }}
                      className="w-12 h-12 rounded-full"
                    />
                    <StyledView className="ml-3">
                      <StyledText className="text-gray-600">
                        Transfer {selectedTransaction.type === 'debit' ? 'to' : 'from'}
                      </StyledText>
                      <StyledText className="text-lg font-medium">
                        {selectedTransaction.bankName}
                      </StyledText>
                    </StyledView>
                  </StyledView>
                  <StyledText className="text-2xl font-semibold text-center mb-2">
                    ₦{selectedTransaction.amount.toLocaleString()}
                  </StyledText>
                  <StyledView
                    className={`self-center px-3 py-1 rounded-full ${selectedTransaction.status === 'successful'
                      ? 'bg-green-100'
                      : selectedTransaction.status === 'pending'
                        ? 'bg-yellow-100'
                        : 'bg-red-100'
                      }`}
                  >
                    <StyledText
                      className={`text-sm capitalize ${selectedTransaction.status === 'successful'
                        ? 'text-green-700'
                        : selectedTransaction.status === 'pending'
                          ? 'text-yellow-700'
                          : 'text-red-700'
                        }`}
                    >
                      {selectedTransaction.status}
                    </StyledText>
                  </StyledView>
                </StyledView>

                {/* Amount Breakdown */}
                <StyledView className="bg-gray-50 p-4 rounded-xl mb-6">
                  <StyledView className="flex-row justify-between mb-2">
                    <StyledText className="text-gray-600">Amount</StyledText>
                    <StyledText className="font-medium">₦{selectedTransaction.amount.toLocaleString()}</StyledText>
                  </StyledView>
                  <StyledView className="flex-row justify-between mb-2">
                    <StyledText className="text-gray-600">Fee</StyledText>
                    <StyledText className="font-medium">₦{selectedTransaction?.fee?.toLocaleString() ?? '0'}</StyledText>
                  </StyledView>
                  <StyledView className="flex-row justify-between pt-2 border-t border-gray-200">
                    <StyledText className="text-gray-600">Total</StyledText>
                    <StyledText className="font-semibold">₦{(selectedTransaction.amount + (selectedTransaction?.fee ?? 0)).toLocaleString()}</StyledText>
                  </StyledView>
                </StyledView>

                {/* Transaction Details */}
                <StyledView className="mb-6">
                  <StyledText className="text-lg font-semibold mb-4">Transaction Details</StyledText>
                  <StyledView className="space-y-3">
                    <StyledView className="flex-row justify-between">
                      <StyledText className="text-gray-600">Recipient</StyledText>
                      <StyledText className="font-medium">{selectedTransaction.accountName}</StyledText>
                    </StyledView>
                    <StyledView className="flex-row justify-between">
                      <StyledText className="text-gray-600">Account Number</StyledText>
                      <StyledText className="font-medium">{selectedTransaction.accountNumber}</StyledText>
                    </StyledView>
                    <StyledView className="flex-row justify-between">
                      <StyledText className="text-gray-600">Remark</StyledText>
                      <StyledText className="font-medium">{selectedTransaction.remark}</StyledText>
                    </StyledView>
                    <StyledView className="flex-row justify-between">
                      <StyledText className="text-gray-600">Type</StyledText>
                      <StyledText className="font-medium">{selectedTransaction.transactionType}</StyledText>
                    </StyledView>
                    <StyledView className="flex-row justify-between">
                      <StyledText className="text-gray-600">Transaction No.</StyledText>
                      <StyledText className="font-medium">{selectedTransaction.transactionNo}</StyledText>
                    </StyledView>
                  </StyledView>
                </StyledView>

                {/* Share Receipt Button */}
                <StyledTouchableOpacity
                  className="bg-primary-600 py-4 rounded-xl"
                  onPress={() => {
                    // Implement share functionality
                    console.log('Share receipt');
                  }}
                >
                  <StyledText className="text-white text-center font-semibold">
                    Share Receipt
                  </StyledText>
                </StyledTouchableOpacity>
              </>
            )}
          </StyledView>
        </StyledTouchableOpacity>
      </Modal>
    </StyledSafeAreaView>
  );
}
