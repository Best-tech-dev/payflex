import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Loader } from '@/components/Loader';
import { OTPInput } from '@/components/OTPInput';
import { colors } from '@/constants/theme';

export default function OTPVerification() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [error, setError] = useState('');

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      // Mock verification delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.replace('/(app)/home');
    } catch (error) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setIsResending(true);
    try {
      // Mock resend delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCountdown(30);
      setError('');
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 px-6 pt-12">
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</Text>
            <Text className="text-base text-gray-600">
              We've sent a 6-digit code to your email
            </Text>
          </View>

          <View className="items-center mb-8">
            <OTPInput
              value={otp}
              onChangeText={setOtp}
              error={error}
            />
            {error && (
              <Text className="text-error mt-2 text-sm">{error}</Text>
            )}
          </View>

          <Button
            title={isLoading ? 'Verifying...' : 'Verify'}
            onPress={handleVerifyOTP}
            disabled={isLoading || otp.length !== 6}
            className="mt-6"
          />

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Didn't receive the code? </Text>
            <TouchableOpacity 
              onPress={handleResendOTP}
              disabled={countdown > 0 || isResending}
            >
              <Text 
                className={`${countdown > 0 || isResending ? 'text-gray-400' : 'text-primary'} font-medium`}
              >
                {isResending ? 'Resending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Resend'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <Loader visible={isLoading || isResending} message={isResending ? 'Sending OTP...' : 'Verifying...'} />
    </SafeAreaView>
  );
} 