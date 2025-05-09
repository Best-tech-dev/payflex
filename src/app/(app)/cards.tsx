// Cards.tsx - Main component file with NativeWind styling
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { api } from '@/services/api';
import { 
  Card, 
  CardType, 
  AVAILABLE_CURRENCIES
} from '../../types/cards';
import CardItem from "../../components/cards/CardItem";
import CardDetailsModal from '../../components/cards/CardDetailsModal';
import GenerateCardModal from '../../components/cards/GenerateCardModal';
import NoCardsView from '../../components/cards/NoCardsView';
import { ErrorModal } from '@/components/common/ErrorModal';
import { SuccessModal } from '@/components/SuccessModal';
import { router } from 'expo-router';

export default function Cards() {
  // State for card management
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [fetchedCards, setFetchedCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [showGenerateCard, setShowGenerateCard] = useState(false);
  
  // State for new card creation
  const [newCardName, setNewCardName] = useState('');
  const [newCardAmount, setNewCardAmount] = useState('');
  const [fundingAmount, setFundingAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(AVAILABLE_CURRENCIES[0]);
  const [pin, setPin] = useState('');
  
  // Modal state variables
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
        
        // Filter to only show virtual cards
        const virtualCards = enhancedCards.filter(card => card.card_type === 'virtual');
        setFetchedCards(virtualCards);
      } 
      // Handle response with success/data format
      else if (response.success && response.data) {
        const enhancedCards = response.data.map((card: Card) => ({
          ...card,
          color: getCardColor(card.card_currency),
          cvv: '123',
          pin: '1234',
          transactions: []
        }));
        
        // Filter to only show virtual cards
        const virtualCards = enhancedCards.filter((card: Card) => card.card_type === 'virtual');
        setFetchedCards(virtualCards);
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

  const toggleCardDetails = () => {
    setShowCardDetails(!showCardDetails);
  };

  const handleGenerateCard = async () => {
    setShowGenerateCard(false);
    setIsLoading(true);
    
    if (!fundingAmount.trim()) {
      setErrorMessage("Please enter a funding amount");
      setShowErrorModal(true);
      setIsLoading(false);
      return;
    }

    if (!pin || pin.length !== 4) {
      setErrorMessage("Please enter a valid 4-digit PIN");
      setShowErrorModal(true);
      setIsLoading(false);
      return;
    }

    setIsGeneratingCard(true);

    try {
      const cardData = {
        currency: selectedCurrency.code,
        funding_amount: fundingAmount,
        pin: pin,
      };

      const res = await api.cards.createCard(cardData);
      
      if(res.success) {
        await fetchCards();
        setSuccessMessage("Your virtual card has been created successfully!");
        setShowSuccessModal(true);
        resetCardFormState();
      } else {
        setErrorMessage(res.message || "Failed to create card");
        setShowErrorModal(true);
      }
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred while creating your card");
      setShowErrorModal(true);
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
  };

  const handleFreezeCard = (card: Card) => {
    setShowDetails(false);
    // Implementation for freezing card would go here
  };

  // Get virtual cards
  const virtualCards = fetchedCards.filter(card => card.card_type === 'virtual');
  const hasCards = virtualCards.length > 0;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-6 pt-6 pb-4">
          <Text className="text-3xl font-bold text-gray-900">Virtual Cards</Text>
          <Text className="text-base text-gray-500 mt-1">Create and manage your virtual cards</Text>
        </View>
        
        {/* Hero Section */}
        <View className="px-6 mb-8">
          {/* Card Preview */}
          <View className="w-full h-52 bg-indigo-600 rounded-2xl p-6 mb-6 shadow-lg">
            <View className="w-10 h-7 bg-yellow-300 rounded-sm mb-10" />
            <Text className="text-white text-xl tracking-wider font-medium mb-10">5399 •••• •••• ••••</Text>
            <View className="flex-row justify-between items-center">
              <Text className="text-white text-base font-medium">Virtual Card</Text>
              <MaterialCommunityIcons name="contactless-payment" size={24} color="white" />
            </View>
          </View>
          
          {/* Features */}
          <View className="mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">Benefits of Virtual Cards</Text>
            <View className="bg-white rounded-xl p-4 shadow">
              <View className="flex-row items-center py-3 border-b border-gray-100">
                <MaterialCommunityIcons name="shield-check-outline" size={24} color={colors.primary.main} />
                <Text className="ml-3 text-base text-gray-700 flex-1">Enhanced security for online purchases</Text>
              </View>
              <View className="flex-row items-center py-3 border-b border-gray-100">
                <MaterialCommunityIcons name="earth" size={24} color={colors.primary.main} />
                <Text className="ml-3 text-base text-gray-700 flex-1">Globally accepted at millions of merchants</Text>
              </View>
              <View className="flex-row items-center py-3 border-b border-gray-100">
                <MaterialCommunityIcons name="currency-usd" size={24} color={colors.primary.main} />
                <Text className="ml-3 text-base text-gray-700 flex-1">Multiple currency options available</Text>
              </View>
              <View className="flex-row items-center py-3">
                <MaterialCommunityIcons name="rocket-launch" size={24} color={colors.primary.main} />
                <Text className="ml-3 text-base text-gray-700 flex-1">Instant issuance with no waiting period</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Create Card Button (only show if no cards) */}
        {!hasCards && (
          <TouchableOpacity 
            style={{
              backgroundColor: '#4F46E5',
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 24,
              marginHorizontal: 24,
              marginBottom: 24,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            onPress={() => router.navigate('/create-card-info')}
          >
            <Text className="text-white text-base font-semibold">Create Virtual Card</Text>
          </TouchableOpacity>
        )}
        
        {/* Cards List or No Cards View */}
        {/* <View className="px-6">
          <Text className="text-xl font-semibold text-gray-900 mb-4">Your Cards</Text>
          
          {isLoading ? (
            <View className="py-10 items-center">
              <ActivityIndicator size="large" color={colors.primary.main} />
              <Text className="mt-4 text-gray-500">Loading your cards...</Text>
            </View>
          ) : hasCards ? (
            <>
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#4F46E5',
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderRadius: 16,
                  marginBottom: 20,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
                onPress={() => router.navigate('/create-card-info')}
              >
                <MaterialCommunityIcons name="plus" size={20} color="white" />
                <Text className="ml-2 text-white text-base font-medium">Create New Virtual Card</Text>
              </TouchableOpacity>
              
              {virtualCards.map(card => (
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
              cardType="virtual"
              onCreateCard={() => setShowGenerateCard(true)}
            />
          )}
        </View> */}
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

      {/* Error and Success Modals */}
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