import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';

export default function Index() {
  // console.log("App State: ", AppState.currentState); // I get this "App State:  inactive" when I open the app
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      console.log("Async Storage keys: ", await AsyncStorage.getAllKeys());
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      const hasSeenOnboarding = await AsyncStorage.getItem('has_seen_onboarding');
  
      // console.log("Has launched:", hasLaunched);
      console.log("Has seen onboarding:", hasSeenOnboarding);
  
      if (hasLaunched === null) {
        // First time launching the app
        await AsyncStorage.setItem('hasLaunched', 'true');
        setIsFirstLaunch(true);
      } else if (!hasSeenOnboarding) {
        // User hasn't completed onboarding
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
      setIsFirstLaunch(false);
    }
  };

  if (isFirstLaunch === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If it's first launch, show onboarding
  if (isFirstLaunch) {
    return <Redirect href="/onboarding" />;
  }

  // If not first launch, redirect based on auth state
  return isAuthenticated ? <Redirect href="/(auth)/pin-verify"/> : <Redirect href="/(auth)/login"/>;

  // If not first launch, redirect based on auth state
  // return isAuthenticated ? <Redirect href="/(app)/home" /> : <Redirect href="/(auth)/login" />;
} 

