import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ErrorModal } from '@/components/common/ErrorModal';
import { api } from '@/services/api';
import { useRegister } from '@/contexts/RegisterContexts';

export default function Step4() {
  const { clearForm } = useRegister();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { register } = useAuth();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(180); // 3 minutes
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startCountdown();
    return () => clearInterval(countdownRef.current as NodeJS.Timeout);
  }, []);

  const startCountdown = () => {
    setResendDisabled(true);
    setCountdown(60);

    countdownRef.current && clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current as NodeJS.Timeout);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (resendDisabled) return;
    startCountdown();
    try {
      console.log("Resending otp...")
      await api.auth.sendOtpToEmail(email);
    } catch (error: any) {
      setErrorMessage('Failed to resend code. Try again later.');
      setShowError(true);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 4) return;
    try {
      setIsLoading(true);
      const verifyOtp = await api.auth.verifyOTP(otp, email);
      if(verifyOtp) {
        clearForm();
      }
    } catch (error: any) {
      setErrorMessage(error?.message || 'Verification failed');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-5">
        {/* Progress indicator */}
        <View className="flex-row justify-between mb-8 mt-4">
          {[1, 2, 3, 4].map((step) => (
            <View key={step} className="flex-1 mx-1">
              <View className={`h-1.5 rounded-full ${step <= 4 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <Text className={`text-xs mt-1 text-center ${step <= 4 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                Step {step}
              </Text>
            </View>
          ))}
        </View>

        <Text className="text-2xl font-bold mb-2">Verify Your Email</Text>
        <Text className="text-base text-gray-500 mb-4">Please enter the 4-digit code sent to:</Text>
        <Text className="text-base font-semibold mb-6">
          {email?.replace(/(.{2})(.*)(@.*)/, '$1•••••$3')}
        </Text>

        <View className="flex-row justify-between mb-6">
          {[0, 1, 2, 3].map((index) => (
            <TextInput
              key={index}
              value={otp[index] || ''}
              onChangeText={(text) => {
                if (text.length <= 1) {
                  const newOtp = otp.split('');
                  newOtp[index] = text;
                  setOtp(newOtp.join(''));
                }
              }}
              keyboardType="numeric"
              maxLength={1}
              className="bg-white w-16 h-16 text-center text-xl border border-gray-300 rounded-lg"
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleResend}
          disabled={resendDisabled}
          style={{ marginBottom: 32, alignSelf: 'center' }}
        >
          <Text className={`text-${resendDisabled ? 'gray-400' : 'blue-600'} text-base`}>
            {resendDisabled ? `Resend code in ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}` : 'Resend Code'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleVerify}
          disabled={otp.length !== 4 || isLoading}
          style={{
            padding: 16,
            borderRadius: 9999,
            backgroundColor: otp.length === 4 && !isLoading ? '#2563eb' : '#d1d5db',
          }}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-white text-center font-semibold">Verify & Create Account</Text>
          )}
        </TouchableOpacity>

        <ErrorModal
          visible={showError}
          error={errorMessage}
          onClose={() => setShowError(false)}
        />
      </View>
    </SafeAreaView>
  );
}
