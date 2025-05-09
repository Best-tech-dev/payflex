import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface AppPinContextType {
  isPinSet: boolean;
  isPinVerified: boolean;
  setupPin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  resetPinVerification: () => void;
  forcePinVerification: () => void;
}

const AppPinContext = createContext<AppPinContextType | null>(null);

const PIN_STORAGE_KEY = '@app_pin';

export function AppPinProvider({ children }: { children: React.ReactNode }) {
  const [isPinSet, setIsPinSet] = useState(false);
  const [isPinVerified, setIsPinVerified] = useState(false);

  // Check if PIN is set on app start
  useEffect(() => {
    checkPinStatus();
  }, []);

  const checkPinStatus = async () => {
    try {
      const pin = await AsyncStorage.getItem(PIN_STORAGE_KEY);
      setIsPinSet(!!pin);
      if (!!pin) {
        console.log('PIN is set. Redirecting to PIN verification...');
        router.replace('/(auth)/pin-verify'); // Redirect to PIN verification screen
      } else {
        console.log('No PIN set. Proceeding to set up pin page...');
        router.replace('/(auth)/pin-setup');
      }
    } catch (error) {
      console.error('Error checking PIN status:', error);
    }
  };

  const setupPin = async (pin: string) => {
    try {
      await AsyncStorage.setItem(PIN_STORAGE_KEY, pin);
      setIsPinSet(true);
      setIsPinVerified(true);
      console.log('PIN setup completed');
    } catch (error) {
      console.error('Error setting up PIN:', error);
      throw error;
    }
  };

  const verifyPin = async (pin: string) => {
    try {
      const storedPin = await AsyncStorage.getItem(PIN_STORAGE_KEY);
      const isValid = pin === storedPin;
      
      if (isValid) {
        console.log('PIN verified successfully');
        setIsPinVerified(true);
        // setLastActiveTime(Date.now());
        
        // Set up a new inactivity timer
        // handleUserActivity();
      } else {
        console.log('PIN verification failed');
      }
      
      return isValid;
    } catch (error) {
      console.error('Error verifying PIN:', error);
      return false;
    }
  };

  const resetPinVerification = () => {
    console.log('PIN verification reset');
    setIsPinVerified(false);
  };

  const forcePinVerification = () => {
    console.log('Forcing PIN verification');
    if (isPinSet) {
      setIsPinVerified(false);
      router.replace('/(auth)/pin-verify');
    }
  };
  return (
    <AppPinContext.Provider 
      value={{ 
        isPinSet, 
        isPinVerified, 
        setupPin, 
        verifyPin, 
        resetPinVerification,
        forcePinVerification
      }}
    >
      {children}
    </AppPinContext.Provider>
  );
}

export function useAppPin() {
  const context = useContext(AppPinContext);
  if (!context) {
    throw new Error('useAppPin must be used within an AppPinProvider');
  }
  return context;
} 