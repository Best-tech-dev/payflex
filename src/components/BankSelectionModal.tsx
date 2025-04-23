import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTextInput = styled(TextInput);

interface Bank {
  id: string;
  code: string;
  name: string;
}

interface BankSelectionModalProps {
  visible: boolean;
  banks: Bank[];
  selectedBank: Bank | null;
  onSelect: (bank: Bank) => void;
  onClose: () => void;
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  bankItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedBankItem: {
    backgroundColor: '#EFF6FF',
  },
  bankName: {
    color: '#111827',
    fontSize: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 8,
  },
  noResults: {
    padding: 16,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#6B7280',
    fontSize: 16,
  },
});

export function BankSelectionModal({
  visible,
  banks,
  selectedBank,
  onSelect,
  onClose,
}: BankSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBanks = useMemo(() => {
    if (!searchQuery) return banks;
    return banks.filter(bank => 
      bank.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [banks, searchQuery]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <StyledView className="flex-1 bg-black/50">
        <StyledSafeAreaView className="flex-1" edges={['top']}>
          <StyledView className="flex-1 bg-white mt-20">
            <StyledView style={styles.header}>
              <StyledText style={styles.headerText}>Select Bank</StyledText>
              <StyledTouchableOpacity 
                style={styles.closeButton}
                onPress={onClose}
              >
                <MaterialCommunityIcons name="close" size={24} color={colors.primary.main} />
              </StyledTouchableOpacity>
            </StyledView>

            <StyledView style={styles.searchContainer}>
              <StyledView className="relative">
                <StyledTextInput
                  style={styles.searchInput}
                  placeholder="Search banks..."
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#9CA3AF"
                />
                <StyledView className="absolute right-3 top-3">
                  <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" />
                </StyledView>
              </StyledView>
            </StyledView>

            {filteredBanks.length === 0 ? (
              <StyledView style={styles.noResults}>
                <StyledText style={styles.noResultsText}>No banks found</StyledText>
              </StyledView>
            ) : (
              <FlatList
                data={filteredBanks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <StyledTouchableOpacity
                    style={[
                      styles.bankItem,
                      selectedBank?.id === item.id && styles.selectedBankItem
                    ]}
                    onPress={() => onSelect(item)}
                  >
                    <StyledText style={styles.bankName}>{item.name}</StyledText>
                  </StyledTouchableOpacity>
                )}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
            )}
          </StyledView>
        </StyledSafeAreaView>
      </StyledView>
    </Modal>
  );
} 