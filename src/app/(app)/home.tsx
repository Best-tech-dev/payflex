import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppPin } from '@/contexts/AppPinContext';
import { colors } from '@/constants/theme';
import { Wallet } from '@/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import components
import Navbar from '@/components/home-component/Navbar';
import WalletCard from '@/components/home-component/WalletCard';
import QuickActions from '@/components/home-component/QuickActions';
import TransactionHistory from '@/components/home-component/TransactionHistory';
import AdvertisementCard from '@/components/home-component/Advertisement';
import FloatingActionButton from '@/components/home-component/FloatingAction';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

// Define proper type for Material Community Icons
type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

// Quick actions data
const quickActions: { id: string; title: string; icon: MaterialIconName; route: string }[] = [
  { id: '1', title: 'Funding', icon: 'wallet', route: '/funding' },
  { id: '6', title: 'Airtime', icon: 'phone', route: '/vtu' },
  { id: '7', title: 'Data', icon: 'wifi', route: '/vtu' },
  { id: '3', title: 'Convert', icon: 'swap-horizontal', route: '/convert' },
  { id: '2', title: 'Send', icon: 'send', route: '/send' },
  { id: '11', title: 'Electricity', icon: 'lightning-bolt', route: '/vas/electricity' },
  { id: '9', title: 'TV', icon: 'television', route: '/vas/tv' },
  { id: '10', title: 'Betting', icon: 'dice-multiple', route: '/vas/betting' },
  { id: '4', title: 'Cards', icon: 'credit-card', route: '/cards' },
  { id: '5', title: 'Bills', icon: 'file-document', route: '/bills' },
  { id: '8', title: 'Giftcards', icon: 'gift', route: '/giftcards' },
  { id: '12', title: 'Education', icon: 'school', route: '/vas/education' },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const params = useLocalSearchParams();
  const paymentSuccessParam = Array.isArray(params.paymentSuccess) ? params.paymentSuccess[0] : params.paymentSuccess;
  const messageParam = Array.isArray(params.message) ? params.message[0] : params.message;
  const transactionId = Array.isArray(params.transactionId) ? params.transactionId[0] : params.transactionId;

  const [appData, setAppData] = useState<{
    user: any;
    wallet_card: Wallet;
    transaction_history: any[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { url, reference } = params;
  
  const router = useRouter();
  const { forcePinVerification } = useAppPin();
  
  // Get payment return params
  const newBalance = Array.isArray(params.newBalance) ? params.newBalance[0] : params.newBalance;

  const fetchAppDetails = async () => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
      return;
    }

    setLoading(true);
    setError(null);
    try {

      // Fetch fresh data
      const data = await api.user.getAppHomepageDetails();
      console.log("Homepage data fetched successfully")
      setAppData(data);

    } catch (error: any) {
      setError(error.message || 'Failed to load app details');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchAppDetails();
    } finally {
      setRefreshing(false);
    }
  };

  const verifyPayment = async (ref: string) => {
    
      try {
        console.log("Verifying paystack payment...");
        const verificationResult = await api.wallet.verifyPaystackPayment(ref);
  
        // console.log("Verification result:", verificationResult);
    
        if (verificationResult.success) {

          console.log("Payment verified successfully:");

          await AsyncStorage.removeItem('pendingPaymentRef');

        } 
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Payment verification failed');
        Alert.alert(
          'Payment Verification Error',
          'We couldn\'t verify your payment status. Your account will be credited automatically if payment was successful.',
          [
            { text: 'Check Status Later', onPress: () => router.back() },
            { text: 'Contact Support', onPress: () => router.push('/support') }
          ]
        );
      } finally {
        setVerifying(false);
      }
    };

  // Handler for when the component comes into focus (for payment return handling)
  useFocusEffect(
    React.useCallback(() => {
      const handlePaymentVerification = async () => {
        if (paymentSuccessParam === 'true') {
          console.log('🏠 Home focused. Payment success param:', paymentSuccessParam);
  
          // Retrieve reference from AsyncStorage
          const storedReference = await AsyncStorage.getItem('pendingPaymentRef');
          console.log("Stored reference:", storedReference);
  
          if (storedReference) {
            console.log('Retrieved reference from AsyncStorage:', storedReference);
            verifyPayment(storedReference); // Call verifyPayment with the retrieved reference
          } else {
            console.error('No reference found in AsyncStorage');
          }
  
          // Refresh app details
          fetchAppDetails();
  
          // Show success alert
          Alert.alert(
            'Payment Successful',
            messageParam || 'Your wallet has been funded successfully.',
            [{ text: 'OK' }]
          );
  
          // Clear the paymentSuccess param
          router.replace('/(app)/home');
        }
      };
  
      handlePaymentVerification();
    }, [paymentSuccessParam, messageParam])
  );

  useEffect(() => {
    fetchAppDetails();
  }, []);

  const handleSeeAllTransactions = () => {
    router.push('/transactions');
  };

  const handleAdvertisementPress = () => {
    router.push('/premium');
  };

  const handleLockApp = () => {
    console.log('Lock app button pressed');
    forcePinVerification();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView 
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Navbar userName={appData?.user?.first_name || '...'} />

        <WalletCard 
          balance={appData?.wallet_card?.current_balance?.toString() || '0'} 
          income={appData?.wallet_card?.all_time_fuunding?.toString() || '0'} 
          expenses={appData?.wallet_card?.all_time_withdrawn?.toString() || '0'} 
          loading={loading}
          error={error}
          onPress={fetchAppDetails}
        />
        <QuickActions actions={quickActions} />
        <TransactionHistory 
          transactions={appData?.transaction_history || []} 
          loading={loading}
          error={error}
          onSeeAllPress={handleSeeAllTransactions}
          onRetry={fetchAppDetails}
        />
        <AdvertisementCard 
          title="Upgrade to Premium"
          description="Get exclusive benefits and rewards"
          iconName="star"
          buttonText="Learn More"
          onButtonPress={handleAdvertisementPress}
        />
        
        {/* Test button for PIN verification */}
        <TouchableOpacity 
          style={styles.lockButton}
          onPress={handleLockApp}
        >
          <MaterialCommunityIcons name="lock" size={20} color={colors.primary.main} />
          <Text style={styles.lockButtonText}>Lock App (Test)</Text>
        </TouchableOpacity>
      </ScrollView>

      <FloatingActionButton 
        iconName="message-text" 
        onPress={() => router.push('/support')} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  lockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    margin: 16,
    marginTop: 8,
  },
  lockButtonText: {
    marginLeft: 8,
    color: colors.primary.main,
    fontWeight: '600',
  },
});