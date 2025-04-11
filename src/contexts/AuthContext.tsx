import React, { createContext, useContext, useState, useEffect } from 'react';
import { router, useSegments, useRootNavigationState } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppPin } from './AppPinContext';
import { AppState } from 'react-native';

// const API_URL = 'http://localhost:1000/api/v1';
const API_URL = 'https://nestjs-payflex.onrender.com/api/v1';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const { isPinSet, isPinVerified } = useAppPin();

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active') {
        console.log('App has resumed');
        // Redirect to the PIN verification screen regardless of the previous state
        router.replace('/(auth)/pin-verify');
      }
    };
  
    const subscription = AppState.addEventListener('change', handleAppStateChange);
  
    return () => {
      subscription.remove();
    };
  }, []);

  // Check for existing token on startup
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          setIsAuthenticated(true);
          // Optionally fetch user data here
        }
      } catch (error) {
        console.error('Error checking token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  // Track if initial navigation has been performed
  const [hasInitialNavigation, setHasInitialNavigation] = useState(false);

  // Handle navigation based on auth state
    useEffect(() => {

    if (!navigationState?.key) {
      console.warn('Invalid navigation state. Resetting...');
      setHasInitialNavigation(false); // Reset navigation state
      return;
    }

    if (isLoading) return;

    const navigateToScreen = async () => {
      try {
    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';
    const inAppGroup = segments[0] === '(app)';
        
        // Check for PIN screens in the path
        const currentPath = segments.join('/');
        const inPinSetup = currentPath.includes('pin-setup');
        const inPinVerification = currentPath.includes('pin-verify');

        // Don't perform navigation if we're already on the correct screen
        if (hasInitialNavigation && (
          (inPinSetup && !isPinSet) ||
          (inPinVerification && isPinSet && !isPinVerified) ||
          (inAuthGroup && !isAuthenticated) ||
          (inAppGroup && isAuthenticated && isPinVerified)
        )) {
          return;
        }
        
        // Determine the target route
        let targetRoute = '';
    
    if (isAuthenticated) {
          if (!isPinSet) {
            targetRoute = '/(auth)/pin-setup';
          } else if (!isPinVerified) {
            targetRoute = '/(auth)/pin-verify';
          } else if (inAuthGroup && !inPinSetup && !inPinVerification) {
            targetRoute = '/(app)/home';
      }
        } else {
          const hasSeenOnboarding = await AsyncStorage.getItem('has_seen_onboarding');
          if (!hasSeenOnboarding) {
            targetRoute = '/onboarding'; // Redirect to onboarding if not completed
          } else {
            targetRoute = '/(auth)/login'; // Redirect to login if onboarding is complete
          }
        }

        // Only navigate if we have a target route and we're not already there
        if (targetRoute && currentPath !== targetRoute.slice(1)) {
          router.replace(targetRoute);
        }

        setHasInitialNavigation(true);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    };

    navigateToScreen();
  }, [isAuthenticated, segments, navigationState?.key, isLoading, isPinSet, isPinVerified, hasInitialNavigation]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      await AsyncStorage.setItem('access_token', data.data.access_token);
      setUser(data.data.user);
      setIsAuthenticated(true);

      console.log("Is pin set: ", isPinSet);
      console.log("Is pin verified: ", isPinVerified);
      if(!isPinSet) {
        router.replace('/(auth)/pin-setup');
      } else {
        router.replace('/(auth)/pin-verify');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password, 
          first_name: firstName, 
          last_name: lastName 
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      // Don't set authenticated state, redirect to login
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  //////////////////////////////////////      From the home Screen
  const logout = async () => {
    console.log("Logging out...");
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('pin_setup_complete');
    // await AsyncStorage.removeItem('@app_pin');
    console.log("Async Data Available afterclear: ", await AsyncStorage.getAllKeys());

    setUser(null);
    setIsAuthenticated(false);

    router.replace('/(auth)/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 