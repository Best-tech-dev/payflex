// components/CardItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, maskCardNumber, formatExpiry, getCurrencySymbol } from "../../types/cards";
import TransactionHistory from '@/components/TransactionHistory';

// Map card_currency to flag images
const currencyFlags: Record<string, string> = {
  USD: 'https://flagcdn.com/us.svg', // US flag
  NGN: 'https://flagcdn.com/ng.svg', // Nigeria flag
  EUR: 'https://flagcdn.com/eu.svg', // EU flag
  GBP: 'https://flagcdn.com/gb.svg', // UK flag
};

interface CardItemProps {
  card: Card;
  showCardDetails: boolean;
  toggleCardDetails: () => void;
  onCardPress: () => void;
}

const CardItem = ({ card, showCardDetails, toggleCardDetails, onCardPress }: CardItemProps) => {
  return (
    <View key={card.id} style={{ marginBottom: 24 }}>
      <TouchableOpacity 
        style={{ 
          marginBottom: 16,
          borderRadius: 16,
          overflow: 'hidden',
          opacity: card.status === 'frozen' ? 0.7 : 1,
        }}
        onPress={onCardPress}
      >
        <View style={{ 
          backgroundColor: card.color,
          padding: 24,
          borderRadius: 16,
          height: 200,
          justifyContent: 'space-between',
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* Add the currency flag dynamically */}
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 8, // Add spacing between flag and text
                }}
              >
                <Text style={{ color: 'white', fontSize: 24 }}>
                  {card.card_currency === 'USD' && '🇺🇸'}
                  {card.card_currency === 'NGN' && '🇳🇬'}
                  {card.card_currency === 'GBP' && '🇬🇧'}
                  {card.card_currency === 'EUR' && '🇪🇺'}
                </Text>
              </View>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                {card.card_brand} {card.card_type.charAt(0).toUpperCase() + card.card_type.slice(1)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {card.status === 'frozen' && (
                <MaterialCommunityIcons name="snowflake" size={20} color="white" style={{ marginRight: 8 }} />
              )}
              <MaterialCommunityIcons name="credit-card" size={24} color="white" />
            </View>
          </View>
          
          <View>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 16, marginBottom: 8 }}>Card Number</Text>
            <Text style={{ color: 'white', fontSize: 20, letterSpacing: 2 }}>
              {showCardDetails ? maskCardNumber(card.masked_pan) : maskCardNumber(card.masked_pan)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 12 }}>Expiry Date</Text>
              <Text style={{ color: 'white', fontSize: 16 }}>
                {showCardDetails ? formatExpiry(card.expiry_month, card.expiry_year) : '••/••'}
              </Text>
            </View>
            <View>
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 12 }}>Balance</Text>
              <Text style={{ color: 'white', fontSize: 16 }}>
                {getCurrencySymbol(card.card_currency)} {card.current_balance.toLocaleString()}
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={{ 
              position: 'absolute',
              right: 60,
              top: 16,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: 8,
              borderRadius: 8,
              zIndex: 10, // Ensure it stays on top of other elements
            }}
            onPress={(e) => {
              e.stopPropagation();
              toggleCardDetails();
            }}
          >
            <MaterialCommunityIcons 
              name={showCardDetails ? "eye-off" : "eye"} 
              size={20} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CardItem;