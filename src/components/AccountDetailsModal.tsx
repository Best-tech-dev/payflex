import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

interface AccountDetailsModalProps {
  visible: boolean;
  accountName: string;
  accountNumber: string;
  bankName: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function AccountDetailsModal({
  visible,
  accountName,
  accountNumber,
  bankName,
  onConfirm,
  onClose,
}: AccountDetailsModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white p-6 rounded-2xl w-11/12">
          <View className="items-center mb-6">
            <View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center mb-4">
              <MaterialCommunityIcons name="account" size={32} color={colors.primary.main} />
            </View>
            <Text className="text-xl font-bold text-gray-900">Account Details</Text>
          </View>

          <View className="space-y-4 mb-6">
            <View>
              <Text className="text-gray-500 text-sm">Account Name</Text>
              <Text className="text-gray-900 text-lg font-medium">{accountName}</Text>
            </View>
            <View>
              <Text className="text-gray-500 text-sm">Account Number</Text>
              <Text className="text-gray-900 text-lg font-medium">{accountNumber}</Text>
            </View>
            <View>
              <Text className="text-gray-500 text-sm">Bank Name</Text>
              <Text className="text-gray-900 text-lg font-medium">{bankName}</Text>
            </View>
          </View>

          <View className="flex-row space-x-4">
            <TouchableOpacity
              style={[{ flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: '#f3f4f6' }]}
              onPress={onClose}
            >
              <Text className="text-center text-gray-900 font-medium">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[{ flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: '#0066FF' }]}
              onPress={onConfirm}
            >
              <Text className="text-center text-white font-medium">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
} 