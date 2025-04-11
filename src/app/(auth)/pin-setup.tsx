import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { OTPInput } from '@/components/OTPInput';
import { Button } from '@/components/Button';
import { colors } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppPin } from '@/contexts/AppPinContext';

export default function PinSetupScreen() {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setupPin } = useAppPin();

  const handlePinChange = (value: string) => {
    if (step === 'create') {
      setPin(value);
      if (value.length === 4) {
        // Move to confirm step after a short delay
        setTimeout(() => {
          setStep('confirm');
        }, 300);
      }
    } else {
      setConfirmPin(value);
      if (value.length === 4) {
        if (value === pin) {
          savePin(value);
        } else {
          setError('PINs do not match. Please try again.');
          setStep('create');
          setPin('');
          setConfirmPin('');
        }
      }
    }
  };

  const savePin = async (pinValue: string) => {
    try {
      setIsLoading(true);
      // Use the AppPinContext to set up the PIN
      await setupPin(pinValue);
      // Mark that PIN is set up
      await AsyncStorage.setItem('pin_setup_complete', 'true');
      // Navigate to home
      router.replace('(app)/home');
    } catch (error) {
      console.error('Error saving PIN:', error);
      Alert.alert('Error', 'Failed to save PIN. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'confirm') {
      setStep('create');
      setConfirmPin('');
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          {/* <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text.primary} />
          </TouchableOpacity> */}
          <Text style={styles.title}>Set Up App PIN</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="lock" size={48} color={colors.primary.main} />
          </View>
        </View>

        <Text style={styles.subtitle}>
          {step === 'create' 
            ? 'Create a 4-digit PIN to secure your app' 
            : 'Confirm your PIN'}
        </Text>

        <View style={styles.otpContainer}>
          <OTPInput
            length={4}
            value={step === 'create' ? pin : confirmPin}
            onChangeText={handlePinChange}
            error={error}
          />
        </View>

        <Text style={styles.hint}>
          {step === 'create' 
            ? 'This PIN will be required to access the app' 
            : 'Enter the same PIN again to confirm'}
        </Text>

        {/* <View style={styles.footer}>
          <Button
            title={step === 'create' ? 'Next' : 'Set PIN'}
            onPress={() => {
              if (step === 'create' && pin.length === 4) {
                setStep('confirm');
              } else if (step === 'confirm' && confirmPin.length === 4) {
                savePin(confirmPin);
              }
            }}
            loading={isLoading}
            disabled={isLoading || (step === 'create' ? pin.length !== 4 : confirmPin.length !== 4)}
          />
        </View> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },
  otpContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  hint: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  footer: {
    marginTop: 'auto',
  },
}); 