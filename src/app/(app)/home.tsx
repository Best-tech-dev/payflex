import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppPin } from '@/contexts/AppPinContext';
import { colors } from '@/constants/theme';
import { Wallet } from '@/types/user';

// Import components
import Navbar from '@/components/home-component/Navbar';
import WalletCard from '@/components/home-component/WalletCard';
import QuickActions from '@/components/home-component/QuickActions';
import TransactionHistory from '@/components/home-component/TransactionHistory';
import AdvertisementCard from '@/components/home-component/Advertisement';
import FloatingActionButton from '@/components/home-component/FloatingAction';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const [walletData, setWalletData] = useState<Wallet | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState([]);
  const [walletLoading, setWalletLoading] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [walletError, setWalletError] = useState(null);
  const [transactionsError, setTransactionsError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [userData, setUserData] = useState<{ name: string; first_name?: string; profile_data?: { first_name?: string } } | null>(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const { url, reference } = params;
  
  const router = useRouter();
  const { forcePinVerification } = useAppPin();
  
  // Get payment return params
  const newBalance = Array.isArray(params.newBalance) ? params.newBalance[0] : params.newBalance;

  // //////////////////////////////////////////////////// Fetch wallet
  const fetchWallet = async () => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }

    setWalletLoading(true);
    setWalletError(null);
    try {
      // Add artificial delay in development
      if (__DEV__) await new Promise(resolve => setTimeout(resolve, 2000));

      const walletResponse = await api.wallet.fetchWallet();
      setWalletData(walletResponse.wallet);
    } catch (error: any) {
      setWalletError(error.message || 'Failed to load wallet');
    } finally {
      setWalletLoading(false);
    }
  };

  // //////////////////////////////////////////////////// Fetch transactions
  const fetchTransactions = async () => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
      return;
    }
  
    setTransactionsLoading(true);
    setTransactionsError(null);
  
    try {
      // Add artificial delay in development
      if (__DEV__) await new Promise(resolve => setTimeout(resolve, 2000));

      // This already returns the parsed data.data
      const data = await api.wallet.fetchTransactions();
      
      // No need to call .json() or check res.ok since 
      // your fetchTransactions already handles that
      
      // Extracting transactions array from the response
      const transactions = data.transactions.map((tx: any) => ({
        id: tx.id,
        type: tx.type,
        amount: parseFloat(tx.amount.replace(/,/g, '')),
        description: tx.description,
        date: tx.date,
        icon: tx.icon || '💸',
        status: tx.status,
        credit_debit: tx.credit_debit,
        color: tx.credit_debit === 'credit' ? colors.success.main : colors.error.main,
      }));

      // console.log("Transactions: ", transactions);
  
      setTransactions(transactions);
    } catch (error: any) {
      setTransactionsError(error.message || 'Failed to load transactions');
    } finally {
      setTransactionsLoading(false);
    }
  };
  
  // //////////////////////////////////////////////////// Fetch user profile
  const fetchUserProfile = async () => {
    setUserLoading(true);
    setUserError(null);
    try {
      // Add artificial delay in development
      if (__DEV__) await new Promise(resolve => setTimeout(resolve, 2000));

      const userProfile = await api.user.getProfile();
      const userProfileData = await userProfile.json();

      if (!userProfileData.success) {
        throw new Error(userProfileData.message || 'Failed to load user profile');
      }

      setUserData(userProfileData.data.profile_data);
    } catch (error: any) {
      setUserError(error.message || 'Failed to load user profile');
    } finally {
      setUserLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchWallet(), fetchUserProfile(), fetchTransactions()]); 
    } finally {
      setRefreshing(false);
    }
  };

  const verifyPayment = async (ref: string) => {
    
      try {
        console.log("Verifying paystack payment...");
        const verificationResult = await api.wallet.verifyPaystackPayment(ref);
  
        console.log("Verification result:", verificationResult);
    
        if (verificationResult.success) {

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
  
          // Refresh wallet and transactions
          fetchWallet();
          fetchTransactions();
  
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
    fetchWallet();
    fetchTransactions();
    fetchUserProfile();
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
        <Navbar userName={userData?.first_name || '...'} />

        <WalletCard 
          balance={walletData?.current_balance?.toString() || '0'} 
          income={walletData?.all_time_fuunding?.toString() || '0'} 
          expenses={walletData?.all_time_withdrawn?.toString() || '0'} 
          loading={walletLoading}
          error={walletError}
          onPress={fetchWallet}
        />
        <QuickActions actions={quickActions} />
        <TransactionHistory 
          transactions={transactions} 
          loading={transactionsLoading}
          error={transactionsError}
          onSeeAllPress={handleSeeAllTransactions}
          onRetry={fetchTransactions}
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