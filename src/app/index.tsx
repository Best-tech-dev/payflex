import { Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';
import { useAppPin } from '@/contexts/AppPinContext';
import { AppState } from 'react-native';

export default function Index() {
  console.log("App State: ", AppState.currentState); // I get this "App State:  inactive" when I open the app
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, checkAuth } = useAuth();
  const { isPinSet } = useAppPin();

  useEffect(() => {
    const initialize = async () => {
      try {
        await checkFirstLaunch();
        await checkAuth(); // Update auth state
        console.log("Auth check complete. Is Authenticated:", isAuthenticated);
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initialize();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      const hasSeenOnboarding = await AsyncStorage.getItem('has_seen_onboarding');
  
      if (hasLaunched === null) {
        await AsyncStorage.setItem('hasLaunched', 'true');
        console.log("'has_launched and is_first_launch': set complete in async storage.")
        setIsFirstLaunch(true);
      } else if (!hasSeenOnboarding) {
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    } catch (error) {
      console.error('Error checking first launch:', error);
      setIsFirstLaunch(false);
    }
  };

  // Show loading indicator while we're checking auth state or first launch
  if (isLoading || isFirstLaunch === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  console.log("Rendering decision point. isFirstLaunch:", isFirstLaunch, 
    "isAuthenticated:", isAuthenticated, "isPinSet:", isPinSet);

  // If it's first launch, show onboarding
  if (isFirstLaunch) {
    return <Redirect href="/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // If authenticated but no PIN set, go to PIN setup
  if (isAuthenticated && !isPinSet) {
    return <Redirect href="/(auth)/pin-setup" />;
  }

  // If authenticated and PIN is set, go to PIN verification
  return <Redirect href="/(auth)/pin-verify" />;
}

