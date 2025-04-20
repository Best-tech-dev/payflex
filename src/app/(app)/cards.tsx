// Cards.tsx - Main component file
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { api } from '@/services/api';
import { 
  Card, 
  CardType, 
  DeliveryAddress,
  AVAILABLE_CURRENCIES
} from '../../types/cards';
import CardItem from "../../components/cards/CardItem";
import CardDetailsModal from '../../components/cards/CardDetailsModal';
import GenerateCardModal from '../../components/cards/GenerateCardModal';
import NoCardsView from '../../components/cards/NoCardsView';
import TransactionHistory from '@/components/TransactionHistory';
import { ErrorModal } from '@/components/ErrorModal';

export default function Cards() {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedTab, setSelectedTab] = useState<CardType>('virtual');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [fetchedCards, setFetchedCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [showGenerateCard, setShowGenerateCard] = useState(false);
  const [newCardName, setNewCardName] = useState('');
  const [newCardAmount, setNewCardAmount] = useState('');
  const [fundingAmount, setFundingAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(AVAILABLE_CURRENCIES[0]);
  const [pin, setPin] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState<DeliveryAddress>({
    fullAddress: '',
    landmark: '',
    city: '',
    state: '',
    phoneNumber: '',
  });
  
  // Get card color based on currency
  const getCardColor = (currency: string) => {
    switch (currency) {
      case 'USD': return '#4F46E5';
      case 'EUR': return '#0891B2';
      case 'GBP': return '#7C3AED';
      case 'NGN': return '#059669';
      default: return '#4F46E5';
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const response = await api.cards.fetchCards();
      console.log("Cards successfully fetched:");
      
      // Check if response is an array (direct cards data)
      if (Array.isArray(response)) {
        // Enhance cards with UI properties
        const enhancedCards = response.map((card) => ({
          ...card,
          color: getCardColor(card.card_currency),
          cvv: '123', // Placeholder
          pin: '1234', // Placeholder
          transactions: [] // Placeholder
        }));
        
        setFetchedCards(enhancedCards);
      } 
      // Keep the original logic for response with success/data format
      else if (response.success && response.data) {
        const enhancedCards = response.data.map((card: Card) => ({
          ...card,
          color: getCardColor(card.card_currency),
          cvv: '123',
          pin: '1234',
          transactions: []
        }));
        
        setFetchedCards(enhancedCards);
        
      } else {
        console.error("Error in response format:", response);
        setFetchedCards([]);
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
      setFetchedCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get cards by type from fetched cards
  const getCardsByType = (type: CardType) => {
    return fetchedCards.filter(card => card.card_type === type);
  };

  const toggleCardDetails = () => {
    setShowCardDetails(!showCardDetails);
  };

  const handleGenerateCard = async () => {

    if (!fundingAmount.trim()) {
      Alert.alert("Error", "Please enter a funding amount");
      return;
    }

    if (!pin || pin.length !== 4) {
      Alert.alert("Error", "Please enter a valid 4-digit PIN");
      return;
    }

    // For physical cards, validate delivery address
    if (selectedTab === 'physical') {
      const { fullAddress, city, state, phoneNumber } = deliveryAddress;
      if (!fullAddress.trim() || !city.trim() || !state.trim() || !phoneNumber.trim()) {
        Alert.alert("Error", "Please complete delivery address details");
        return;
      }
    }

    setIsGeneratingCard(true);

    try {
      // Prepare data for API call
      const cardData = {
        card_name: newCardName.trim(),
        card_type: selectedTab,
        card_currency: selectedCurrency,
        funding_amount: parseFloat(fundingAmount),
        pin: pin,
        ...(selectedTab === 'physical' && { delivery_address: deliveryAddress })
      };

      // Update the API method to accept and send the card data
      const cardDataForApi = {
        currency: cardData.card_currency.code,
        funding_amount: cardData.funding_amount.toString(),
        pin: cardData.pin,
        ...(cardData.card_type === 'physical' && { delivery_address: cardData.delivery_address }),
      };

      console.log("Card data for API:", cardDataForApi);

      const createdCard = await api.cards.createCard(cardDataForApi);
      
      console.log("Card created successfully:", createdCard);
      
      // Refresh cards list to show the new card
      await fetchCards();
      
      // Show success message
      Alert.alert(
        "Success", 
        `Your ${selectedTab} card has been created successfully!`,
        [{ text: "OK" }]
      );
      
      // Close modal and reset form
      setShowGenerateCard(false);
      resetCardFormState();
    } catch (error: any) {
      const errorMsg = error.message || String(error);
      setErrorMessage(`Failed to create ${selectedTab} card: ${errorMsg}`);
      setShowError(true);
      
    } finally {
      setIsGeneratingCard(false);
    }
  };

  const resetCardFormState = () => {
    setNewCardName('');
    setNewCardAmount('');
    setFundingAmount('');
    setPin('');
    setDeliveryAddress({
      fullAddress: '',
      landmark: '',
      city: '',
      state: '',
      phoneNumber: '',
    });
  };

  const handleFreezeCard = (card: Card) => {
    setShowDetails(false);
  };

  useEffect(() => {
    console.log("Error modal state:", { showError, errorMessage });
  }, [showError, errorMessage]);

  // Get the cards for the current selected tab
  const currentTabCards = getCardsByType(selectedTab);
  const hasCards = currentTabCards.length > 0;

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
        </View>
        
        {/* Cards List or No Cards View */}
        <View style={{ paddingHorizontal: 24, flex: 1 }}>
          {isLoading ? (
            <View style={{ paddingVertical: 50, alignItems: 'center' }}>
              <Text>Loading your cards...</Text>
            </View>
          ) : hasCards ? (
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
                <Text style={{ marginLeft: 8, color: 'white', fontSize: 14, fontWeight: '500' }}>
                  Create New {selectedTab === 'virtual' ? 'Virtual' : 'Physical'} Card
                </Text>
              </TouchableOpacity>
              
              {currentTabCards.map(card => (
                <CardItem 
                  key={card.id}
                  card={card}
                  showCardDetails={showCardDetails}
                  toggleCardDetails={toggleCardDetails}
                  onCardPress={() => {
                    setSelectedCard(card);
                    setShowDetails(true);
                  }}
                />
              ))}
            </>
          ) : (
            <NoCardsView
              cardType={selectedTab}
              onCreateCard={() => setShowGenerateCard(true)}
            />
          )}
        </View>
      </ScrollView>
      
      {/* Modals */}
      <CardDetailsModal
        visible={showDetails}
        card={selectedCard}
        showCardDetails={showCardDetails}
        toggleCardDetails={toggleCardDetails}
        onClose={() => setShowDetails(false)}
        onFreezeCard={handleFreezeCard}
      />
      
      <GenerateCardModal 
        visible={showGenerateCard}
        cardType={selectedTab}
        cardName={newCardName}
        setCardName={setNewCardName}
        cardAmount={newCardAmount}
        setCardAmount={setNewCardAmount}
        fundingAmount={fundingAmount}
        setFundingAmount={setFundingAmount}
        selectedCurrency={selectedCurrency.code}
        setSelectedCurrency={(currency) => setSelectedCurrency(AVAILABLE_CURRENCIES.find(c => c.code === currency) || AVAILABLE_CURRENCIES[0])}
        pin={pin}
        setPin={setPin}
        deliveryAddress={deliveryAddress}
        setDeliveryAddress={setDeliveryAddress}
        onClose={() => setShowGenerateCard(false)}
        onGenerateCard={handleGenerateCard}
        isLoading={isGeneratingCard}
      />

      <ErrorModal
        visible={showError}
        message={errorMessage}
        onClose={() => setShowError(false)}
      />
    </SafeAreaView>
  );
}