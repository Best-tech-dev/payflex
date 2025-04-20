// components/NoCardsView.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CardType } from '../../types/cards';
import { colors } from '@/constants/theme';

interface NoCardsViewProps {
  cardType: CardType;
  onCreateCard: () => void;
}

const NoCardsView = ({ cardType, onCreateCard }: NoCardsViewProps) => {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      paddingVertical: 60,
      paddingHorizontal: 24
    }}>
      <MaterialCommunityIcons 
        name="credit-card-outline" 
        size={64} 
        color="#D1D5DB" 
        style={{ marginBottom: 16 }} 
      />
      <Text style={{ fontSize: 18, fontWeight: '500', color: '#6B7280', marginBottom: 8, textAlign: 'center' }}>
        No {cardType} cards yet
      </Text>
      <Text style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 24, textAlign: 'center' }}>
        Create your first {cardType} card to get started
      </Text>
      <TouchableOpacity 
        style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          backgroundColor: colors.primary.main, 
          paddingHorizontal: 16,
          paddingVertical: 12, 
          borderRadius: 12,
        }}
        onPress={onCreateCard}
      >
        <MaterialCommunityIcons name="plus" size={20} color="white" />
        <Text style={{ marginLeft: 8, color: 'white', fontSize: 14, fontWeight: '500' }}>
          Create New {cardType === 'virtual' ? 'Virtual' : 'Physical'} Card
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoCardsView;