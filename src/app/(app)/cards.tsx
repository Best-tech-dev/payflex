import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Image, Animated, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TransactionHistory, { Transaction } from '@/components/TransactionHistory';

type CardType = 'physical' | 'virtual';
type CardStatus = 'active' | 'frozen' | 'expired';

// Available currencies
const AVAILABLE_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
];

interface Card {
  id: string;
  type: CardType;
  name: string;
  number: string;
  expiry: string;
  cvv: string;
  pin: string;
  balance: number;
  currency: string;
  color: string;
  gradient: string[];
  status: CardStatus;
  transactions: Transaction[];
  deliveryAddress?: string; // For physical cards
}

interface DeliveryAddress {
  fullAddress: string;
  landmark: string;
  city: string;
  state: string;
  phoneNumber: string;
}

// Mock data for cards with their transactions
const cards: { [key in CardType]: Card[] } = {
  physical: [
    {
      id: '1',
      type: 'physical' as CardType,
      name: 'PayFlex Premium',
      number: '1234 5678 9012 3456',
      expiry: '12/25',
      cvv: '123',
      pin: '1234',
      balance: 5000.00,
      currency: 'USD',
      color: '#1E40AF', // Deep blue
      gradient: ['#1E40AF', '#3B82F6'],
      status: 'active' as CardStatus,
      transactions: [
        {
          id: '1',
          description: 'Amazon Purchase',
          amount: -150.00,
          date: '2024-03-15T10:30:00',
          status: 'successful',
          type: 'debit',
        },
        {
          id: '2',
          description: 'Netflix Subscription',
          amount: -14.99,
          date: '2024-03-14T08:15:00',
          status: 'successful',
          type: 'debit',
        },
        {
          id: '3',
          description: 'Uber Ride',
          amount: -25.50,
          date: '2024-03-13T18:45:00',
          status: 'successful',
          type: 'debit',
        }
      ]
    }
  ],
  virtual: [
    {
      id: '2',
      type: 'virtual' as CardType,
      name: 'PayFlex Virtual',
      number: '9876 5432 1098 7654',
      expiry: '09/24',
      cvv: '456',
      pin: '5678',
      balance: 2500.00,
      currency: 'USD',
      color: '#7C3AED', // Purple
      gradient: ['#7C3AED', '#A78BFA'],
      status: 'active' as CardStatus,
      transactions: [
        {
          id: '4',
          description: 'Starbucks',
          amount: -5.75,
          date: '2024-03-12T09:20:00',
          status: 'successful',
          type: 'debit',
        },
        {
          id: '5',
          description: 'Spotify Premium',
          amount: -9.99,
          date: '2024-03-11T07:30:00',
          status: 'successful',
          type: 'debit',
        },
        {
          id: '6',
          description: 'Apple Store',
          amount: -99.99,
          date: '2024-03-10T15:45:00',
          status: 'successful',
          type: 'debit',
        }
      ]
    }
  ]
};

export default function Cards() {
  const [selectedTab, setSelectedTab] = useState<CardType>('physical');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [showGenerateCard, setShowGenerateCard] = useState(false);
  const [newCardName, setNewCardName] = useState('');
  const [newCardAmount, setNewCardAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(AVAILABLE_CURRENCIES[0]);
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    fullAddress: '',
    landmark: '',
    city: '',
    state: '',
    phoneNumber: '',
  });
  const fadeAnim = new Animated.Value(0);

  const CARD_CREATION_FEE = {
    physical: 5000, // 5000 NGN
    virtual: 0, // Free for virtual cards
  };

  const toggleCardDetails = () => {
    setShowCardDetails(!showCardDetails);
    Animated.timing(fadeAnim, {
      toValue: showCardDetails ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const maskCardNumber = (number: string) => {
    return number.replace(/\d(?=\d{4})/g, "•");
  };

  const handleGenerateCard = () => {
    // Check if user already has a card with the selected currency
    const existingCard = cards[selectedTab].find(card => card.currency === selectedCurrency.code);
    if (existingCard) {
      // Remove the existing card
      const index = cards[selectedTab].indexOf(existingCard);
      cards[selectedTab].splice(index, 1);
    }

    const newCard: Card = {
      id: Date.now().toString(),
      type: selectedTab,
      name: newCardName || `PayFlex ${selectedTab === 'virtual' ? 'Virtual' : 'Physical'}`,
      number: '9876 5432 1098 7654', // This would be generated by the backend
      expiry: '09/24',
      cvv: '456',
      pin: '5678',
      balance: parseFloat(newCardAmount) || 0,
      currency: selectedCurrency.code,
      color: selectedTab === 'virtual' ? '#7C3AED' : '#1E40AF',
      gradient: selectedTab === 'virtual' ? ['#7C3AED', '#A78BFA'] : ['#1E40AF', '#3B82F6'],
      status: 'active' as CardStatus,
      transactions: [],
      ...(selectedTab === 'physical' && { deliveryAddress: JSON.stringify(deliveryAddress) }),
    };

    cards[selectedTab].push(newCard);
    setShowGenerateCard(false);
    setNewCardName('');
    setNewCardAmount('');
    setDeliveryAddress({
      fullAddress: '',
      landmark: '',
      city: '',
      state: '',
      phoneNumber: '',
    });
  };

  const handleFreezeCard = (card: Card) => {
    // In a real app, this would call an API to freeze/unfreeze the card
    card.status = card.status === 'active' ? 'frozen' : 'active';
    setShowDetails(false);
  };

  const renderCard = (card: Card) => (
    <View key={card.id} style={{ marginBottom: 24 }}>
      <TouchableOpacity 
        style={{ 
          marginBottom: 16,
          borderRadius: 16,
          overflow: 'hidden',
          opacity: card.status === 'frozen' ? 0.7 : 1,
        }}
        onPress={() => {
          setSelectedCard(card);
          setShowDetails(true);
        }}
      >
        <View style={{ 
          backgroundColor: card.color,
          padding: 24,
          borderRadius: 16,
          height: 200,
          justifyContent: 'space-between',
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{card.name}</Text>
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
              {showCardDetails ? card.number : maskCardNumber(card.number)}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 12 }}>Expiry Date</Text>
              <Text style={{ color: 'white', fontSize: 16 }}>
                {showCardDetails ? card.expiry : '••/••'}
              </Text>
            </View>
            <View>
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 12 }}>Balance</Text>
              <Text style={{ color: 'white', fontSize: 16 }}>{card.currency} {card.balance.toLocaleString()}</Text>
            </View>
          </View>

          <TouchableOpacity 
            style={{ 
              position: 'absolute',
              right: 16,
              top: 16,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: 8,
              borderRadius: 8,
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

      {/* Card-specific transactions */}
      <TransactionHistory 
        transactions={card.transactions}
        maxItems={3}
        showHeader={true}
        onViewAll={() => {
          setSelectedCard(card);
          setShowDetails(true);
        }}
      />
    </View>
  );

  const renderCurrencySelector = () => (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 4 }}>Currency</Text>
      <View style={{ 
        flexDirection: 'row', 
        flexWrap: 'wrap',
        gap: 8,
      }}>
        {AVAILABLE_CURRENCIES.map((currency) => {
          const isPhysicalCard = selectedTab === 'physical';
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
      {selectedTab === 'physical' && (
        <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 4 }}>
          Other currencies for physical cards coming soon
        </Text>
      )}
    </View>
  );

  const renderDeliveryAddressFields = () => (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 4 }}>Delivery Address</Text>
      
      <View style={{ marginBottom: 12 }}>
        <Text style={{ color: '#6B7280', fontSize: 12, marginBottom: 4 }}>Full Address</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
          }}
          placeholder="Enter full house address"
          value={deliveryAddress.fullAddress}
          onChangeText={(text) => setDeliveryAddress({ ...deliveryAddress, fullAddress: text })}
          multiline
          numberOfLines={2}
        />
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={{ color: '#6B7280', fontSize: 12, marginBottom: 4 }}>Landmark</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
          }}
          placeholder="Enter nearby landmark"
          value={deliveryAddress.landmark}
          onChangeText={(text) => setDeliveryAddress({ ...deliveryAddress, landmark: text })}
        />
      </View>

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#6B7280', fontSize: 12, marginBottom: 4 }}>City</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
            }}
            placeholder="Enter city"
            value={deliveryAddress.city}
            onChangeText={(text) => setDeliveryAddress({ ...deliveryAddress, city: text })}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#6B7280', fontSize: 12, marginBottom: 4 }}>State</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
            }}
            placeholder="Enter state"
            value={deliveryAddress.state}
            onChangeText={(text) => setDeliveryAddress({ ...deliveryAddress, state: text })}
          />
        </View>
      </View>

      <View>
        <Text style={{ color: '#6B7280', fontSize: 12, marginBottom: 4 }}>Phone Number for Pickup</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
          }}
          placeholder="Enter phone number"
          value={deliveryAddress.phoneNumber}
          onChangeText={(text) => setDeliveryAddress({ ...deliveryAddress, phoneNumber: text })}
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );

  const renderGenerateCardModal = () => {

    return (
      <Modal
        visible={showGenerateCard}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGenerateCard(false)}
      >
        <SafeAreaView style={{ 
          flex: 1, 
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: 20,
        }}>
          <View style={{ 
            backgroundColor: 'white', 
            width: '100%',
            height: '80%',
            borderRadius: 16,
            padding: 24,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: 24,
              borderBottomWidth: 1,
              borderBottomColor: '#E5E7EB',
              paddingBottom: 16,
            }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>
                Create New {selectedTab === 'virtual' ? 'Virtual' : 'Physical'} Card
              </Text>
              <TouchableOpacity onPress={() => setShowGenerateCard(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={{ flex: 1 }}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              <View style={{ marginBottom: 16 }}>
                <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 4 }}>Card Name</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                    backgroundColor: 'white',
                  }}
                  placeholder="Enter card name"
                  value={newCardName}
                  onChangeText={setNewCardName}
                />
              </View>

              {renderCurrencySelector()}

              <View style={{ marginBottom: 16 }}>
                <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 4 }}>Initial Balance</Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 16,
                    backgroundColor: 'white',
                  }}
                  placeholder="Enter amount"
                  keyboardType="numeric"
                  value={newCardAmount}
                  onChangeText={setNewCardAmount}
                />
              </View>

              {selectedTab === 'physical' && renderDeliveryAddressFields()}

              <View style={{ 
                backgroundColor: '#FEF3C7', 
                padding: 12, 
                borderRadius: 8,
                marginBottom: 16,
              }}>
                <Text style={{ color: '#92400E', fontSize: 14 }}>
                  Note: If you already have a {selectedTab} card with the selected currency, it will be replaced with this new one.
                </Text>
              </View>

              <View style={{ 
                backgroundColor: '#F3F4F6', 
                padding: 12, 
                borderRadius: 8,
                marginBottom: 24,
              }}>
                <Text style={{ color: '#111827', fontSize: 14, fontWeight: '500' }}>
                  Card Creation Fee: {CARD_CREATION_FEE[selectedTab].toLocaleString()} NGN
                </Text>
                <Text style={{ color: '#6B7280', fontSize: 12, marginTop: 4 }}>
                  This amount will be debited from your wallet balance upon card creation.
                </Text>
              </View>

              <TouchableOpacity 
                style={{ 
                  backgroundColor: colors.primary.main, 
                  padding: 16, 
                  borderRadius: 12,
                  alignItems: 'center',
                  marginBottom: 20,
                }}
                onPress={handleGenerateCard}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Generate Card</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>Cards</Text>
        </View>

        {/* Tabs */}
        <View style={{ 
          flexDirection: 'row', 
          paddingHorizontal: 24, 
          marginBottom: 24,
          borderBottomWidth: 1,
          borderBottomColor: '#E5E7EB',
        }}>
          <TouchableOpacity 
            style={{ 
              flex: 1, 
              paddingVertical: 12,
              borderBottomWidth: 2,
              borderBottomColor: selectedTab === 'physical' ? colors.primary.main : 'transparent',
            }}
            onPress={() => setSelectedTab('physical')}
          >
            <Text style={{ 
              textAlign: 'center', 
              color: selectedTab === 'physical' ? colors.primary.main : '#6B7280',
              fontWeight: selectedTab === 'physical' ? '600' : '400',
            }}>
              Physical Cards
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ 
              flex: 1, 
              paddingVertical: 12,
              borderBottomWidth: 2,
              borderBottomColor: selectedTab === 'virtual' ? colors.primary.main : 'transparent',
            }}
            onPress={() => setSelectedTab('virtual')}
          >
            <Text style={{ 
              textAlign: 'center', 
              color: selectedTab === 'virtual' ? colors.primary.main : '#6B7280',
              fontWeight: selectedTab === 'virtual' ? '600' : '400',
            }}>
              Virtual Cards
            </Text>
          </TouchableOpacity>
        </View>

        {/* Cards List */}
        <View style={{ paddingHorizontal: 24 }}>
          {selectedTab === 'physical' ? (
            <>
              <TouchableOpacity 
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  backgroundColor: colors.primary.main, 
                  paddingHorizontal: 16,
                  paddingVertical: 12, 
                  borderRadius: 12,
                  marginBottom: 16,
                }}
                onPress={() => setShowGenerateCard(true)}
              >
                <MaterialCommunityIcons name="plus" size={20} color="white" />
                <Text style={{ marginLeft: 8, color: 'white', fontSize: 14, fontWeight: '500' }}>Create New Physical Card</Text>
              </TouchableOpacity>
              {cards.physical.map(renderCard)}
            </>
          ) : (
            <>
              <TouchableOpacity 
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  backgroundColor: colors.primary.main, 
                  paddingHorizontal: 16,
                  paddingVertical: 12, 
                  borderRadius: 12,
                  marginBottom: 16,
                }}
                onPress={() => setShowGenerateCard(true)}
              >
                <MaterialCommunityIcons name="plus" size={20} color="white" />
                <Text style={{ marginLeft: 8, color: 'white', fontSize: 14, fontWeight: '500' }}>Create New Virtual Card</Text>
              </TouchableOpacity>
              {cards.virtual.map(renderCard)}
            </>
          )}
        </View>
      </ScrollView>

      {/* Card Details Modal */}
      <Modal
        visible={showDetails}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDetails(false)}
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
              <TouchableOpacity onPress={() => setShowDetails(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            {selectedCard && (
              <>
                <View style={{ marginBottom: 16 }}>
                  <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 4 }}>Card Number</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, color: '#111827' }}>
                      {showCardDetails ? selectedCard.number : maskCardNumber(selectedCard.number)}
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
                    <Text style={{ fontSize: 18, color: '#111827' }}>{selectedCard.expiry}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 4 }}>CVV</Text>
                    <Text style={{ fontSize: 18, color: '#111827' }}>
                      {showCardDetails ? selectedCard.cvv : '•••'}
                    </Text>
                  </View>
                </View>

                <View style={{ marginBottom: 16 }}>
                  <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 4 }}>PIN</Text>
                  <Text style={{ fontSize: 18, color: '#111827' }}>
                    {showCardDetails ? selectedCard.pin : '••••'}
                  </Text>
                </View>

                <View style={{ marginBottom: 24 }}>
                  <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 4 }}>Available Balance</Text>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>
                    {selectedCard.currency} {selectedCard.balance.toLocaleString()}
                  </Text>
                </View>

                <TouchableOpacity 
                  style={{ 
                    backgroundColor: selectedCard.status === 'active' ? colors.primary.main : '#EF4444', 
                    padding: 16, 
                    borderRadius: 12,
                    alignItems: 'center',
                  }}
                  onPress={() => handleFreezeCard(selectedCard)}
                >
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                    {selectedCard.status === 'active' ? 'Freeze Card' : 'Unfreeze Card'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {renderGenerateCardModal()}
    </SafeAreaView>
  );
} 