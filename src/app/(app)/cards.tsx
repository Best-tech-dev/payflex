// Cards.tsx - Main component file
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
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
import { ErrorModal } from '@/components/common/ErrorModal';
import { SuccessModal } from '@/components/SuccessModal';

export default function Cards() {
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
  
  // Modal state variables - matching accounts.tsx pattern
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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
        setErrorMessage("Failed to load cards data");
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
      setFetchedCards([]);
      setErrorMessage(error instanceof Error ? error.message : "Failed to fetch cards");
      setShowErrorModal(true);
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
    setShowGenerateCard(false);
    setIsLoading(true);
    if (!fundingAmount.trim()) {
      setErrorMessage("Please enter a funding amount");
      setShowErrorModal(true);
      
      return;
    }

    if (!pin || pin.length !== 4) {
      setErrorMessage("Please enter a valid 4-digit PIN");
      setShowErrorModal(true);
      return;
    }

    if (selectedTab === 'physical') {
      const { fullAddress, city, state, phoneNumber } = deliveryAddress;
      if (!fullAddress.trim() || !city.trim() || !state.trim() || !phoneNumber.trim()) {
        setErrorMessage("Please complete delivery address details");
        setShowErrorModal(true);
        return;
      }
    }

    setIsGeneratingCard(true);

    try {
      const cardData = {
        currency: selectedCurrency.code,
        funding_amount: fundingAmount,
        pin: pin,
        ...(selectedTab === 'physical' && { delivery_address: deliveryAddress }),
      };

      const res = await api.cards.createCard(cardData);
      
      if(res.success) {
        await fetchCards();
        setSuccessMessage(`Your ${selectedTab} card has been created successfully!`);
        setShowSuccessModal(true);
        setShowGenerateCard(false);
        resetCardFormState();
      } else {
        setErrorMessage(res.message || "Failed to create card");
        setShowErrorModal(true);
        setIsLoading(false);
      }
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred while creating your card");
      setShowErrorModal(true);
      setIsLoading(false);
    } finally {
      setIsGeneratingCard(false);
      setIsLoading(false);
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
              <ActivityIndicator size="large" color={colors.primary.main} />
              <Text style={{ marginTop: 16, color: '#6B7280' }}>Loading your cards...</Text>
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

      {/* Error and Success Modals - following accounts.tsx pattern */}
      <ErrorModal
        visible={showErrorModal}
        error={errorMessage}
        onClose={() => setShowErrorModal(false)}
      />

      <SuccessModal
        visible={showSuccessModal}
        title="Card Created"
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
        autoClose={true}
        autoCloseTime={3000}
      />
    </SafeAreaView>
  );
}