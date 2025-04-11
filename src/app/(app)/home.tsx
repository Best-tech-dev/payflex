import React, { useState, useEffect } from 'react';
import { ScrollView, RefreshControl, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppPin } from '@/contexts/AppPinContext';
import { colors } from '@/constants/theme';

// Import components
import Navbar from '@/components/home-component/Navbar';
import WalletCard from '@/components/home-component/WalletCard';
import QuickActions from '@/components/home-component/QuickActions';
import TransactionHistory, { Transaction } from '@/components/home-component/TransactionHistory';
import AdvertisementCard from '@/components/home-component/Advertisement';
import FloatingActionButton from '@/components/home-component/FloatingAction';

// Define proper type for Material Community Icons
type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

// Mock data with proper typing
const transactions: Transaction[] = [
  { id: '1', type: 'credit', amount: 5000, description: 'Salary Payment', date: 'Apr 8th, 17:23:58', icon: '💰', status: 'successful' },
  { id: '2', type: 'debit', amount: 1500, description: 'Netflix Subscription', date: 'Apr 7th, 14:15:30', icon: '🎬', status: 'pending' },
  { id: '3', type: 'credit', amount: 2000, description: 'Freelance Work', date: 'Apr 6th, 09:45:12', icon: '💼', status: 'failed' },
];

const quickActions: { id: string; title: string; icon: MaterialIconName; route: string }[] = [
  { id: '1', title: 'Funding', icon: 'wallet', route: '/funding' },
  { id: '2', title: 'Send', icon: 'send', route: '/send' },
  { id: '3', title: 'Convert', icon: 'swap-horizontal', route: '/convert' },
  { id: '4', title: 'Cards', icon: 'credit-card', route: '/cards' },
  { id: '5', title: 'Bills', icon: 'file-document', route: '/bills' },
  { id: '6', title: 'Airtime', icon: 'phone', route: '/vtu' },
  { id: '7', title: 'Data', icon: 'wifi', route: '/vtu' },
  { id: '8', title: 'Giftcards', icon: 'gift', route: '/giftcards' },
  { id: '9', title: 'TV', icon: 'television', route: '/vas/tv' },
  { id: '10', title: 'Betting', icon: 'dice-multiple', route: '/vas/betting' },
  { id: '11', title: 'Electricity', icon: 'lightning-bolt', route: '/vas/electricity' },
  { id: '12', title: 'Education', icon: 'school', route: '/vas/education' },
];

export default function Home() {
  const [refreshing, setRefreshing] = useState(false);
  const [balance] = useState(new Animated.Value(0));
  const [displayBalance, setDisplayBalance] = useState('23,000');
  const router = useRouter();
  const { forcePinVerification, verifyPin } = useAppPin()
  
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
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
        <Navbar userName="Mayowa" />
        <WalletCard balance={displayBalance} income="5,000" expenses="1,500" />
        <QuickActions actions={quickActions} />
        <TransactionHistory 
          transactions={transactions} 
          onSeeAllPress={handleSeeAllTransactions} 
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