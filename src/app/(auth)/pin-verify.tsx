import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { OTPInput } from '@/components/OTPInput';
import { Button } from '@/components/Button';
import { colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';
import { useAppPin } from '@/contexts/AppPinContext';

export default function PinVerifyScreen() {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const { verifyPin } = useAppPin();

  // Log when the component mounts
  useEffect(() => {
    console.log('PIN verification screen mounted');
    return () => {
      console.log('PIN verification screen unmounted');
    };
  }, []);

  const handlePinChange = (value: string) => {
    setPin(value);
    setError('');
    
    if (value.length === 4) {
      verifyPinValue(value);
    }
  };

  const verifyPinValue = async (pinValue: string) => {
    try {
      setIsLoading(true);
      
      // Use the AppPinContext to verify the PIN
      const isValid = await verifyPin(pinValue);
      
      if (isValid) {
        // PIN is correct, navigate to home
        console.log('PIN verified, navigating to home'); 
        router.replace('(app)/home');
      } else {
        // PIN is incorrect
        console.log('PIN verification failed');
        setError('Incorrect PIN. Please try again.');
        setPin('');
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
      Alert.alert('Error', 'Failed to verify PIN. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPin = async () => {
    Alert.alert(
      'Forgot PIN',
      'You will need to log in again to reset your PIN. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',
          onPress: async () => {
            // Clear authentication data
            await AsyncStorage.removeItem('access_token');
            await AsyncStorage.removeItem('pin_setup_complete');
            // Navigate to login
            router.replace('(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="lock" size={48} color={colors.primary.main} />
          </View>
        </View>

        <Text style={styles.title}>Enter App PIN</Text>
        <Text style={styles.subtitle}>Enter your 4-digit PIN to access the app</Text>

        <View style={styles.otpContainer}>
          <OTPInput
            length={4}
            value={pin}
            onChangeText={handlePinChange}
            error={error}
          />
        </View>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <Text style={styles.hint}>This PIN protects your account</Text>
        )}

        <TouchableOpacity 
          style={styles.forgotPinButton}
          onPress={handleForgotPin}
        >
          <Text style={styles.forgotPinText}>Forgot PIN?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  otpContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  hint: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: colors.error.main,
    textAlign: 'center',
    marginBottom: 16,
  },
  forgotPinButton: {
    marginTop: 16,
  },
  forgotPinText: {
    fontSize: 14,
    color: colors.primary.main,
    fontWeight: '500',
  },
}); 