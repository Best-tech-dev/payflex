import React, { createContext, useContext, useState, useEffect } from 'react';
import { router, useSegments, useRootNavigationState } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppPin } from './AppPinContext';
import { AppState, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/services/api';

const API_URL = 'http://localhost:1000/api/v1';
// const API_URL = 'https://nestjs-payflex.onrender.com/api/v1';

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
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>; // Add this function
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const navigationState = useRootNavigationState();
  const { isPinSet, isPinVerified } = useAppPin();
  const [currentRoutePath, setCurrentRoutePath] = useState<string | null>(null);

    // Track the current route
    useEffect(() => {
      if (!navigationState?.key) return;
      
      const currentSegments = segments;
      if (currentSegments.length > 0) {
        setCurrentRoutePath('/' + currentSegments.join('/'));
      }
    }, [segments, navigationState?.key]);

    useEffect(() => {
      interface AppStateChangeHandler {
        (nextAppState: string): void;
      }

      const handleAppStateChange: AppStateChangeHandler = (nextAppState) => {
        if (
          (Platform.OS === 'ios' && nextAppState === 'active') ||
          (Platform.OS === 'android' && 
           (nextAppState === 'active' || AppState.currentState?.match(/inactive|background/) && nextAppState === 'active'))
        ) {
          console.log('App has resumed, current path:', currentRoutePath);
          handleRoutingOnResume();
        }
      };
  
      const subscription = AppState.addEventListener('change', handleAppStateChange);
      return () => subscription.remove();
    }, [isAuthenticated, isPinSet, isPinVerified, currentRoutePath]);

    const handleRoutingOnResume = () => {
      // Determine where the app should go
      let targetRoute = '/(app)/home';

      console.log("Auth state: ", { isAuthenticated, isPinSet, isPinVerified });
      
      if (!isAuthenticated) {
        targetRoute = '/(auth)/login';
      } else if (isAuthenticated && isPinSet && !isPinVerified) {
        targetRoute = '/(auth)/pin-verify';
      }else if (isAuthenticated && !isPinSet) {
        targetRoute = '/(auth)/pin-setup';
      } 
      
      // Don't navigate if we're already on the correct screen
      // We're comparing route paths not including dynamic segments
      const currentPathBase = currentRoutePath?.split('?')[0] || '';
      const targetPathBase = targetRoute.split('?')[0];
      
      // Check if current route starts with the target route (to handle nested routes)
      // Or if they're the same route
      if (!currentPathBase.startsWith(targetPathBase) && currentPathBase !== targetPathBase) {
        console.log(`Navigating from ${currentPathBase} to ${targetRoute}`);
        router.replace(targetRoute);
      } else {
        console.log(`Already on correct route (${currentPathBase}), not navigating`);
      }
    };

  // Check for existing token on startup
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('access_token');
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

  // Check authentication status
  const checkAuth = async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      const isAuth = !!token;
      setIsAuthenticated(isAuth);
      return isAuth;
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await api.auth.login(email, password);
      const data = await res.json();
  
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }
  
      await SecureStore.setItemAsync('access_token', data.data.access_token);
      setUser(data.data.user);
      setIsAuthenticated(true);
  
      if (!isPinSet) {
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
      const res = await api.auth.register(email, password, firstName, lastName);
      const data = await res.json();
  
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
      }
  
      await SecureStore.setItemAsync('access_token', data.data.access_token);
      setUser(data.data.user);
      setIsAuthenticated(true);
  
      if (!isPinSet) {
        router.replace('/(auth)/pin-setup');
      } else {
        router.replace('/(auth)/pin-verify');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };
  
  const logout = async () => {
    console.log("Logging out...");
    
    console.log("Async Data Available before clear: ", await AsyncStorage.getAllKeys());
    
    // Remove the exact keys as they appear in storage
    await SecureStore.deleteItemAsync('access_token');
    await AsyncStorage.removeItem('pin_setup_complete');
    await AsyncStorage.removeItem('@app_pin');
    await AsyncStorage.removeItem('hasLaunched');
    // await AsyncStorage.removeItem('has_seen_onboarding');
    
    console.log("Async Data Available after clear: ", await AsyncStorage.getAllKeys());
    
    setUser(null);
    setIsAuthenticated(false);
    
    router.replace('/(auth)/login');
};

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout, checkAuth }}>
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