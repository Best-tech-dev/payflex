// components/CardDetailsModal.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, maskCardNumber, formatExpiry, getCurrencySymbol } from '../../types/cards';
import { colors } from '@/constants/theme';

interface CardDetailsModalProps {
  visible: boolean;
  card: Card | null;
  showCardDetails: boolean;
  toggleCardDetails: () => void;
  onClose: () => void;
  onFreezeCard: (card: Card) => void;
}

const CardDetailsModal = ({ 
  visible, 
  card, 
  showCardDetails, 
  toggleCardDetails, 
  onClose, 
  onFreezeCard 
}: CardDetailsModalProps) => {
  if (!card) return null;
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ 
          backgroundColor: 'white', 
          width: '90%', 
          borderRadius: 16,
          padding: 24,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>Card Details</Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialCommunityIcons name="close" size={24} color="#111827" />
            </TouchableOpacity>
          </View>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 4 }}>Card Number</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, color: '#111827' }}>
                {showCardDetails ? card.masked_pan : maskCardNumber(card.masked_pan)}
              </Text>
              <TouchableOpacity 
                style={{ marginLeft: 8 }}
                onPress={toggleCardDetails}
              >
                <MaterialCommunityIcons 
                  name={showCardDetails ? "eye-off" : "eye"} 
                  size={20} 
                  color={colors.primary.main} 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 4 }}>Expiry Date</Text>
              <Text style={{ fontSize: 18, color: '#111827' }}>
                {formatExpiry(card.expiry_month, card.expiry_year)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 4 }}>CVV</Text>
              <Text style={{ fontSize: 18, color: '#111827' }}>
                {showCardDetails ? (card.cvv || '•••') : '•••'}
              </Text>
            </View>
          </View>
          
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 4 }}>PIN</Text>
            <Text style={{ fontSize: 18, color: '#111827' }}>
              {showCardDetails ? (card.pin || '••••') : '••••'}
            </Text>
          </View>
          
          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 4 }}>Available Balance</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>
              {getCurrencySymbol(card.card_currency)} {card.current_balance.toLocaleString()}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={{ 
              backgroundColor: card.status === 'active' ? colors.primary.main : '#EF4444', 
              padding: 16, 
              borderRadius: 12,
              alignItems: 'center',
            }}
            onPress={() => onFreezeCard(card)}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
              {card.status === 'active' ? 'Freeze Card' : 'Unfreeze Card'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CardDetailsModal;