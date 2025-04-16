import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface GeneratedAccountModalProps {
  visible: boolean;
  amount: string;
  accountNumber: string;
  bank: string;
  countdown: number | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function GeneratedAccountModal({
  visible,
  amount,
  accountNumber,
  bank,
  countdown,
  onClose,
  onConfirm,
}: GeneratedAccountModalProps) {
  // In GeneratedAccountModal.tsx, find the formatAmount function and replace it with:
const formatAmount = (value: string) => {
  // First, parse as a number to handle decimal points properly
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '';
  
  // Then format with the Intl formatter
  const formatted = new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numValue);
  
  return `₦${formatted}`;
};

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <StyledView className="flex-1 bg-black/50 justify-center items-center">
        <StyledView className="bg-white rounded-2xl p-4 w-full max-w-sm">
          <StyledView className="flex-row justify-between items-center mb-6">
            <StyledText className="text-xl font-semibold text-gray-900">
              Payment Details
            </StyledText>
            <StyledTouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#111827" />
            </StyledTouchableOpacity>
          </StyledView>

          <StyledView className="space-y-3">
            <StyledView>
              <StyledText className="text-gray-600 mb-1">Amount</StyledText>
              <StyledText className="text-xl font-bold text-gray-900">
                {formatAmount(amount)}
              </StyledText>
            </StyledView>

            <StyledView className="flex-row items-center mb-3">
              <StyledView className="bg-red-100 p-1.5 rounded-full">
                <StyledText className="text-red-600 text-xs font-medium">
                  {countdown ? `${Math.floor(countdown / 60)}m ${countdown % 60}s` : '0m 0s'}
                </StyledText>
              </StyledView>
            </StyledView>

            <StyledView className="space-y-2">
              <StyledView className="flex-row items-center">
                <MaterialCommunityIcons name="bank" size={18} color="#4B5563" />
                <StyledText className="ml-2 text-gray-600">
                  <StyledText className="font-semibold">Account Number:</StyledText> {accountNumber}
                </StyledText>
              </StyledView>
              <StyledView className="flex-row items-center">
                <MaterialCommunityIcons name="bank-transfer" size={18} color="#4B5563" />
                <StyledText className="ml-2 text-gray-600">
                  <StyledText className="font-semibold">Bank:</StyledText> {bank}
                </StyledText>
              </StyledView>
            </StyledView>

            <StyledView className="flex-row justify-center space-x-2">
              <StyledTouchableOpacity
                className="flex-1 bg-[#0066FF] py-2.5 rounded-lg"
                onPress={onConfirm}
              >
                <StyledText className="text-white text-center font-semibold text-sm">
                  Confirm Payment
                </StyledText>
              </StyledTouchableOpacity>
              <StyledTouchableOpacity
                className="flex-1 py-2.5 rounded-lg border border-gray-300"
                onPress={onClose}
              >
                <StyledText className="text-gray-600 text-center font-medium text-sm">
                  Close
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledView>
    </Modal>
  );
}
