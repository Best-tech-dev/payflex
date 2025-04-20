// components/CurrencySelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AVAILABLE_CURRENCIES, CardType } from '../../types/cards';
import { colors } from '@/constants/theme';

interface CurrencySelectorProps {
  selectedCurrency: typeof AVAILABLE_CURRENCIES[0];
  setSelectedCurrency: (currency: typeof AVAILABLE_CURRENCIES[0]) => void;
  cardType: CardType;
}

const CurrencySelector = ({ selectedCurrency, setSelectedCurrency, cardType }: CurrencySelectorProps) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 4 }}>Currency</Text>
      <View style={{ 
        flexDirection: 'row', 
        flexWrap: 'wrap',
        gap: 8,
      }}>
        {AVAILABLE_CURRENCIES.map((currency) => {
          const isPhysicalCard = cardType === 'physical';
          const isNGN = currency.code === 'NGN';
          const isDisabled = isPhysicalCard && !isNGN;
          
          return (
            <TouchableOpacity
              key={currency.code}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 8,
                borderRadius: 8,
                backgroundColor: isDisabled 
                  ? '#F3F4F6' 
                  : selectedCurrency.code === currency.code 
                    ? colors.primary.main 
                    : '#F3F4F6',
                opacity: isDisabled ? 0.5 : 1,
              }}
              onPress={() => !isDisabled && setSelectedCurrency(currency)}
              disabled={isDisabled}
            >
              <Text style={{ 
                color: selectedCurrency.code === currency.code ? 'white' : '#111827',
                marginRight: 4,
              }}>
                {currency.symbol}
              </Text>
              <Text style={{ 
                color: selectedCurrency.code === currency.code ? 'white' : '#111827',
              }}>
                {currency.code}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {cardType === 'physical' && (
        <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 4 }}>
          Other currencies for physical cards coming soon
        </Text>
      )}
    </View>
  );
};

export default CurrencySelector;