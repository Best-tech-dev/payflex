import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Modal, ActivityIndicator, RefreshControl } from 'react-native';
import { styled } from 'nativewind';
import { useRouter, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import { api } from '@/services/api';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { format } from 'date-fns';
import { Loader } from '@/components/Loader';

// Styled components for NativeWind
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);
const StyledSafeAreaView = styled(SafeAreaView);

const categories = ['All Categories', 'Airtime', 'Data', 'Transfers', 'Bills', 'Funding'];
const statuses = ['All Status', 'Successful', 'Pending', 'Failed'];

interface ScrollEvent {
  layoutMeasurement: {
    height: number;
  };
  contentOffset: {
    y: number;
  };
  contentSize: {
    height: number;
  };
}

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
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchTransactions = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setPage(1);
        setHasMore(true);
      }
      
      const currentPage = isRefreshing ? 1 : page;
      const response = await api.wallet.fetchTransactions(limit);
      console.log("(transactions.tsx) -- Transactions fetched");
      
      if (response && Array.isArray(response.transactions)) {
        if (isRefreshing) {
          setTransactions(response.transactions);
        } else {
          setTransactions(prev => [...prev, ...response.transactions]);
        }
        setHasMore(response.transactions.length === limit);
      } else {
        console.warn("(transactions.tsx) -- Invalid transactions data received:");
        if (isRefreshing) {
          setTransactions([]);
        }
      }
    } catch (error) {
      console.error("(transactions.tsx) -- Error fetching transactions:", error);
      if (isRefreshing) {
        setTransactions([]);
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTransactions(true);
  }, []);

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      setPage(prev => prev + 1);
      fetchTransactions();
    }
  }, [loadingMore, hasMore]);

  const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: ScrollEvent) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  const handleBack = () => router.back();
  const handleDownload = () => {
    // Implement download functionality
    console.log('Download transactions');
  };

  const handleShareReceipt = async (transaction: any) => {
    try {
      // Create HTML content for the receipt
      const html = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .amount { font-size: 24px; font-weight: bold; text-align: center; margin: 20px 0; }
              .status { text-align: center; padding: 5px 10px; border-radius: 15px; margin: 10px 0; }
              .details { margin: 20px 0; }
              .detail-row { display: flex; justify-content: space-between; margin: 10px 0; }
              .label { color: #666; }
              .value { font-weight: bold; }
              .footer { text-align: center; margin-top: 30px; color: #666; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Transaction Receipt</h2>
            </div>
            <div class="amount" style="color: ${transaction.credit_debit === 'credit' ? '#10B981' : '#EF4444'}">
              ${transaction.credit_debit === 'credit' ? '+' : '-'}₦${transaction.amount?.toLocaleString() || '0'}
            </div>
            <div class="status" style="background-color: ${
              transaction.status === 'success' ? '#D1FAE5' : 
              transaction.status === 'pending' ? '#FEF3C7' : '#FEE2E2'
            }; color: ${
              transaction.status === 'success' ? '#10B981' : 
              transaction.status === 'pending' ? '#F59E0B' : '#EF4444'
            }">
              ${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </div>
            <div class="details">
              <div class="detail-row">
                <span class="label">Description:</span>
                <span class="value">${transaction.description || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="label">Type:</span>
                <span class="value">${transaction.transaction_type || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">${transaction.date}</span>
              </div>
              <div class="detail-row">
                <span class="label">Reference:</span>
                <span class="value">${transaction.id || 'N/A'}</span>
              </div>
            </div>
            <div class="footer">
              <p>Generated on ${format(new Date(), 'PPP')}</p>
            </div>
          </body>
        </html>
      `;

      // Generate PDF
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false
      });

      // Share the PDF
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Transaction Receipt',
        UTI: 'com.adobe.pdf'
      });
    } catch (error) {
      console.error('Error sharing receipt:', error);
      // You might want to show an error toast here
    }
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

  const TransactionCard = ({ transaction }: { transaction: any }) => (
    <StyledTouchableOpacity
      className="flex-row items-center bg-white p-4 rounded-xl mb-3 shadow-sm"
      onPress={() => {
        setSelectedTransaction(transaction);
        setShowTransactionDetails(true);
      }}
    >
      <View style={{ 
        width: 40, 
        height: 40, 
        borderRadius: 20, 
        backgroundColor: transaction.credit_debit === 'credit' ? '#D1FAE5' : '#FEE2E2',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12
      }}>
        <MaterialCommunityIcons
          name={transaction.credit_debit === 'credit' ? 'arrow-up' : 'arrow-down'}
          size={20}
          color={transaction.credit_debit === 'credit' ? '#10B981' : '#EF4444'}
        />
      </View>
      <StyledView className="flex-1">
        <StyledText className="text-gray-900 font-medium text-sm mb-4">{transaction.description || 'Transaction'}</StyledText>
        <StyledText className="text-gray-500 text-xs">{transaction.date}</StyledText>
      </StyledView>
      <StyledView className="items-end">
        <StyledText
          style={{
            fontWeight: '600',
            color: transaction.credit_debit === 'credit' ? '#10B981' : '#EF4444',
            fontSize: 14,
            marginBottom: 4,
          }}
        >
          {transaction.credit_debit === 'credit' ? '+' : '-'}₦{transaction.amount?.toLocaleString() || '0'}
        </StyledText>
        <StyledText
          style={{
            fontSize: 12,
            color:
              transaction.status === 'success'
                ? '#10B981'
                : transaction.status === 'pending'
                ? '#F59E0B'
                : '#EF4444',
          }}
        >
          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
        </StyledText>
      </StyledView>
    </StyledTouchableOpacity>
  );

  return (
    <StyledSafeAreaView className="flex-1 bg-gray-50">
      <Loader visible={isLoading} message="Fetching transactions..." />
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
      <StyledScrollView 
        className="flex-1 px-4"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary.main]}
            tintColor={colors.primary.main}
          />
        }
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            loadMore();
          }
        }}
        scrollEventThrottle={400}
      >
        {transactions.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Text style={{ color: '#6B7280', textAlign: 'center' }}>No transactions found</Text>
          </View>
        ) : (
          <>
            {transactions.map((transaction, index) => (
              <TransactionCard key={`${transaction.id}-${index}`} transaction={transaction} />
            ))}
            {loadingMore && (
              <View className="py-4 items-center">
                <ActivityIndicator size="small" color={colors.primary.main} />
              </View>
            )}
            {!hasMore && transactions.length > 0 && (
              <View className="py-4 items-center">
                <Text className="text-gray-500">No more transactions</Text>
              </View>
            )}
          </>
        )}
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

                {/* Transaction Info */}
                <StyledView className="mb-6">
                  <StyledView className="items-center mb-4">
                    <View style={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: 24, 
                      backgroundColor: selectedTransaction.credit_debit === 'credit' ? '#D1FAE5' : '#FEE2E2',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 12
                    }}>
                      <MaterialCommunityIcons
                        name={selectedTransaction.credit_debit === 'credit' ? 'arrow-up' : 'arrow-down'}
                        size={24}
                        color={selectedTransaction.credit_debit === 'credit' ? '#10B981' : '#EF4444'}
                      />
                    </View>
                    <StyledText 
                      style={{
                        fontSize: 24,
                        fontWeight: '600',
                        color: selectedTransaction.credit_debit === 'credit' ? '#10B981' : '#EF4444',
                        marginBottom: 8
                      }}
                    >
                      {selectedTransaction.credit_debit === 'credit' ? '+' : '-'}₦{selectedTransaction.amount?.toLocaleString() || '0'}
                    </StyledText>
                    <StyledView
                      className={`self-center px-3 py-1 rounded-full ${
                        selectedTransaction.status === 'success'
                          ? 'bg-green-100'
                          : selectedTransaction.status === 'pending'
                          ? 'bg-yellow-100'
                          : 'bg-red-100'
                      }`}
                    >
                      <StyledText
                        style={{
                          fontSize: 12,
                          color:
                            selectedTransaction.status === 'success'
                              ? '#10B981'
                              : selectedTransaction.status === 'pending'
                              ? '#F59E0B'
                              : '#EF4444',
                        }}
                      >
                        {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                      </StyledText>
                    </StyledView>
                  </StyledView>
                </StyledView>

                {/* Transaction Details */}
                <StyledView className="mb-6">
                  <StyledText className="text-lg font-semibold mb-4">Transaction Details</StyledText>
                  <StyledView className="space-y-3">
                    <StyledView className="flex-row justify-between">
                      <StyledText className="text-gray-600">Description</StyledText>
                      <StyledText className="font-medium">{selectedTransaction.description || 'N/A'}</StyledText>
                    </StyledView>
                    <StyledView className="flex-row justify-between">
                      <StyledText className="text-gray-600">Type</StyledText>
                      <StyledText className="font-medium capitalize">{selectedTransaction.transaction_type || 'N/A'}</StyledText>
                    </StyledView>
                    <StyledView className="flex-row justify-between">
                      <StyledText className="text-gray-600">Date</StyledText>
                      <StyledText className="font-medium">{selectedTransaction.date}</StyledText>
                    </StyledView>
                    <StyledView className="flex-row justify-between">
                      <StyledText className="text-gray-600">Reference</StyledText>
                      <StyledText className="font-medium">{selectedTransaction.id || 'N/A'}</StyledText>
                    </StyledView>
                  </StyledView>
                </StyledView>

                {/* Share Receipt Button */}
                <StyledTouchableOpacity
                  style={{
                    backgroundColor: colors.primary.main,
                    paddingVertical: 16,
                    borderRadius: 12,
                    marginTop: 8
                  }}
                  onPress={() => handleShareReceipt(selectedTransaction)}
                >
                  <StyledText style={{ color: 'white', textAlign: 'center', fontWeight: '600' }}>
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
