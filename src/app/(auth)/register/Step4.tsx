// File: src/app/(auth)/register/Step4.tsx
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useRegister } from '@/contexts/RegisterContexts';
import { useAuth } from '@/contexts/AuthContext';
import { ErrorModal } from '@/components/common/ErrorModal';

export default function Step4() {
  const { formData } = useRegister();
  const { register } = useAuth();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);

  // Handle OTP resend
  const handleResend = () => {
    if (resendDisabled) return;
    
    // Disable resend button and start countdown
    setResendDisabled(true);
    let timer = countdown;
    
    const interval = setInterval(() => {
      timer -= 1;
      setCountdown(timer);
      
      if (timer <= 0) {
        clearInterval(interval);
        setResendDisabled(false);
        setCountdown(30);
      }
    }, 1000);
  };

  // Handle final verification and registration
  const handleVerify = async () => {
    if (otp.length !== 4) return;
    
    try {
      setIsLoading(true);
      
      // Extract the necessary fields from formData
      const { firstName, surname, email, password } = formData;
      
      // Call the register function from AuthContext
      // await register(email, password, firstName, surname);
      
      // Navigate to OTP verification (the actual API call would happen here)
      router.replace({
        pathname: '/(auth)/otp-verification',
        params: { email: formData.email }
      });
    } catch (error: any) {
      setErrorMessage(error?.message || 'Registration failed');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-5">
      
      {/* Progress indicator */}
      <View className="flex-row justify-between mb-8">
        {[1, 2, 3, 4].map((step) => (
          <View key={step} className="flex-1 mx-1">
            <View 
              className={`h-1.5 rounded-full ${step <= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}
            />
            <Text className={`text-xs mt-1 text-center ${step <= 3 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
              Step {step}
            </Text>
          </View>
        ))}
      </View>
      
      <Text className="text-2xl font-bold mb-2">Verify Your Email</Text>
      <Text className="text-base text-gray-500 mb-4">
        Please enter the 4-digit code sent to:
      </Text>
      <Text className="text-base font-semibold mb-6">
        {formData.email?.replace(/(.{2})(.*)(@.*)/, '$1•••••$3')}
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
                
                // Auto-focus next input if text was entered
                if (text.length === 1 && index < 3) {
                  // This would require refs to implement fully
                }
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
          {resendDisabled ? `Resend code in ${countdown}s` : 'Resend Code'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={handleVerify}
        disabled={otp.length !== 4 || isLoading}
        style={{
          padding: 16,
          borderRadius: 9999,
          backgroundColor: otp.length === 4 && !isLoading ? '#2563eb' : '#d1d5db'
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
  );
}