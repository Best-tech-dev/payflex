// GenerateCardModal.tsx
import React from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Or your preferred picker component
import { CardType, DeliveryAddress, AVAILABLE_CURRENCIES } from '../../types/cards';
import { colors } from '@/constants/theme';

interface GenerateCardModalProps {
  visible: boolean;
  cardType: CardType;
  cardName: string;
  setCardName: (name: string) => void;
  cardAmount: string;
  setCardAmount: (amount: string) => void;
  fundingAmount: string;
  setFundingAmount: (amount: string) => void;
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  pin: string;
  setPin: (pin: string) => void;
  deliveryAddress: DeliveryAddress;
  setDeliveryAddress: (address: DeliveryAddress) => void;
  onClose: () => void;
  onGenerateCard: () => void;
  isLoading?: boolean;
}

// Add currency emojis mapping
const CURRENCY_EMOJIS: Record<string, string> = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  NGN: '🇳🇬'
};

// Add amount formatting function
const formatAmount = (value: string) => {
  // Remove any non-numeric characters except decimal point
  const numericValue = value.replace(/[^0-9.]/g, '');
  
  // If empty, return empty string
  if (!numericValue) return '';
  
  // Format the number with commas
  const parts = numericValue.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return `$${parts.join('.')}`;
};

const GenerateCardModal: React.FC<GenerateCardModalProps> = ({
  visible,
  cardType,
  cardName,
  setCardName,
  cardAmount,
  setCardAmount,
  fundingAmount,
  setFundingAmount,
  selectedCurrency,
  setSelectedCurrency,
  pin,
  setPin,
  deliveryAddress,
  setDeliveryAddress,
  onClose,
  onGenerateCard,
  isLoading = false
}) => {
  const updateDeliveryAddress = (field: keyof DeliveryAddress, value: string) => {
    setDeliveryAddress({
      ...deliveryAddress,
      [field]: value
    });
  };

  // Add validation function
  const isFormValid = () => {
    if (!selectedCurrency || !fundingAmount.trim() || !pin || pin.length !== 4) {
      return false;
    }
    if (cardType === 'physical') {
      const { fullAddress, city, state, phoneNumber } = deliveryAddress;
      if (!fullAddress.trim() || !city.trim() || !state.trim() || !phoneNumber.trim()) {
        return false;
      }
    }
    return true;
  };

  // Add handler for funding amount changes
  const handleFundingAmountChange = (value: string) => {
    const formatted = formatAmount(value);
    setFundingAmount(value.replace(/[^0-9.]/g, ''));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{ 
        flex: 1, 
        backgroundColor: 'rgba(0,0,0,0.5)', 
        justifyContent: 'flex-end' 
      }}>
        <View style={{ 
          backgroundColor: 'white', 
          borderTopLeftRadius: 24, 
          borderTopRightRadius: 24,
          padding: 24,
          maxHeight: '90%'
        }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
              Create New {cardType === 'virtual' ? 'Virtual' : 'Physical'} Card
            </Text>
            
            {/* Card name input */}
            {/* <View style={{ marginBottom: 16 }}>
              <Text style={{ marginBottom: 8, fontWeight: '500' }}>Card Name</Text>
              <TextInput
                style={{ 
                  borderWidth: 1, 
                  borderColor: '#E5E7EB', 
                  borderRadius: 8, 
                  padding: 12 
                }}
                placeholder="Enter card name"
                value={cardName}
                onChangeText={setCardName}
              />
            </View> */}
            
            {/* Currency selector with emojis */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ marginBottom: 8, fontWeight: '500' }}>Currency</Text>
              <View style={{ 
                borderWidth: 1, 
                borderColor: '#E5E7EB', 
                borderRadius: 8, 
                overflow: 'hidden' 
              }}>
                <Picker
                  selectedValue={selectedCurrency}
                  onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
                >
                  {AVAILABLE_CURRENCIES.map((currency) => (
                    <Picker.Item 
                      key={currency.code} 
                      label={`${CURRENCY_EMOJIS[currency.code] || ''} ${currency.name}`} 
                      value={currency.code} 
                    />
                  ))}
                </Picker>
              </View>
            </View>
            
            {/* Funding amount input with formatting */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ marginBottom: 8, fontWeight: '500' }}>Funding Amount</Text>
              <TextInput
                style={{ 
                  borderWidth: 1, 
                  borderColor: '#E5E7EB', 
                  borderRadius: 8, 
                  padding: 12 
                }}
                placeholder={`Enter amount in ${selectedCurrency}`}
                value={formatAmount(fundingAmount)}
                onChangeText={handleFundingAmountChange}
                keyboardType="numeric"
              />
            </View>
            
            {/* PIN input */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ marginBottom: 8, fontWeight: '500' }}>PIN (4 digits)</Text>
              <TextInput
                style={{ 
                  borderWidth: 1, 
                  borderColor: '#E5E7EB', 
                  borderRadius: 8, 
                  padding: 12 
                }}
                placeholder="Enter 4-digit PIN"
                value={pin}
                onChangeText={setPin}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
            </View>
            
            {/* Delivery address fields (for physical cards only) */}
            {cardType === 'physical' && (
              <>
                <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 8, marginBottom: 16 }}>
                  Delivery Address
                </Text>
                
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ marginBottom: 8, fontWeight: '500' }}>Full Address</Text>
                  <TextInput
                    style={{ 
                      borderWidth: 1, 
                      borderColor: '#E5E7EB', 
                      borderRadius: 8, 
                      padding: 12 
                    }}
                    placeholder="Enter your full address"
                    value={deliveryAddress.fullAddress}
                    onChangeText={(value) => updateDeliveryAddress('fullAddress', value)}
                  />
                </View>
                
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ marginBottom: 8, fontWeight: '500' }}>Landmark (Optional)</Text>
                  <TextInput
                    style={{ 
                      borderWidth: 1, 
                      borderColor: '#E5E7EB', 
                      borderRadius: 8, 
                      padding: 12 
                    }}
                    placeholder="Enter a nearby landmark"
                    value={deliveryAddress.landmark}
                    onChangeText={(value) => updateDeliveryAddress('landmark', value)}
                  />
                </View>
                
                <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={{ marginBottom: 8, fontWeight: '500' }}>City</Text>
                    <TextInput
                      style={{ 
                        borderWidth: 1, 
                        borderColor: '#E5E7EB', 
                        borderRadius: 8, 
                        padding: 12 
                      }}
                      placeholder="City"
                      value={deliveryAddress.city}
                      onChangeText={(value) => updateDeliveryAddress('city', value)}
                    />
                  </View>
                  
                  <View style={{ flex: 1, marginLeft: 8 }}>
                    <Text style={{ marginBottom: 8, fontWeight: '500' }}>State</Text>
                    <TextInput
                      style={{ 
                        borderWidth: 1, 
                        borderColor: '#E5E7EB', 
                        borderRadius: 8, 
                        padding: 12 
                      }}
                      placeholder="State"
                      value={deliveryAddress.state}
                      onChangeText={(value) => updateDeliveryAddress('state', value)}
                    />
                  </View>
                </View>
                
                <View style={{ marginBottom: 24 }}>
                  <Text style={{ marginBottom: 8, fontWeight: '500' }}>Phone Number</Text>
                  <TextInput
                    style={{ 
                      borderWidth: 1, 
                      borderColor: '#E5E7EB', 
                      borderRadius: 8, 
                      padding: 12 
                    }}
                    placeholder="Contact phone number"
                    value={deliveryAddress.phoneNumber}
                    onChangeText={(value) => updateDeliveryAddress('phoneNumber', value)}
                    keyboardType="phone-pad"
                  />
                </View>
              </>
            )}
            
            {/* Action buttons with validation */}
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <TouchableOpacity
                style={{ 
                  flex: 1, 
                  padding: 14, 
                  backgroundColor: '#F3F4F6', 
                  borderRadius: 8,
                  alignItems: 'center',
                  marginRight: 8
                }}
                onPress={onClose}
                disabled={isLoading}
              >
                <Text style={{ fontWeight: '500', color: '#4B5563' }}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{ 
                  flex: 1, 
                  padding: 14, 
                  backgroundColor: isFormValid() ? colors.primary.main : '#E5E7EB', 
                  borderRadius: 8,
                  alignItems: 'center',
                  marginLeft: 8
                }}
                onPress={onGenerateCard}
                disabled={isLoading || !isFormValid()}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={{ 
                    fontWeight: '500', 
                    color: isFormValid() ? 'white' : '#9CA3AF' 
                  }}>
                    Create Card
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default GenerateCardModal;