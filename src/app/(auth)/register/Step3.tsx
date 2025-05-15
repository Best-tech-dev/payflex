// File: src/app/(auth)/register/Step3.tsx
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import Checkbox from 'expo-checkbox';
import { useRegister } from '@/contexts/RegisterContexts';
import { useAuth } from '@/contexts/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ErrorModal } from '@/components/common/ErrorModal';

const validatePassword = (pw: string) => {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw),
    number: /\d/.test(pw),
  };
};

export default function Step3() {
  const { formData, updateForm } = useRegister();
  const { register } = useAuth();
  const [password, setPassword] = useState(formData.password || '');
  const [confirm, setConfirm] = useState(formData.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatesOptIn, setUpdatesOptIn] = useState(formData.updatesOptIn || false);
  const [agree, setAgree] = useState(formData.agree || false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const validations = validatePassword(password);
  const passwordsMatch = password === confirm;
  const allValid = Object.values(validations).every(Boolean) && passwordsMatch && agree;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleNext = () => {
    if (!allValid) return;
    updateForm({ password, updatesOptIn, agree });
    router.push('/(auth)/register/Step4');
  };

  // Handle registration with backend
  const handleRegister = async () => {
    if (!allValid) return;
    
    try {
      setIsLoading(true);
      
      // Log all form data being sent to backend
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.surname,
        email: formData.email,
        password: password,
        country: formData.country,
        phone: formData.phone,
        gender: formData.gender,
        middleName: formData.middleName,
        referral: formData.referral,
        updatesOptIn: updatesOptIn
      };
      
      console.log('Registration data being sent to backend:', registrationData);
      
      // Call the register function from AuthContext
      await register(
        formData.email,
        password,
        formData.firstName,
        formData.surname
      );
      
      // Update form data before navigating
      updateForm({ password, updatesOptIn, agree });
      
      // Navigate to OTP verification
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
    <ScrollView className="flex-1 bg-white p-5">
      {/* Progress indicator */}
      <View className="flex-row justify-between mb-8 mt-2">
        {[1, 2, 3, 4].map((step) => (
          <View 
            key={step} 
            className={`h-2 flex-1 mx-1 rounded-full ${step <= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}
          />
        ))}
      </View>
      
      <Text className="text-2xl font-bold mb-2">Create Password</Text>
      <Text className="text-base text-gray-500 mb-6">Choose a secure password for your account</Text>
      
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
        <View className="relative">
          <TextInput
            placeholder="Enter Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            className="bg-white px-4 py-3 rounded-lg border border-gray-300 text-base pr-12"
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: [{ translateY: -12 }],
            }}
            onPress={togglePasswordVisibility}
          >
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">Confirm Password</Text>
        <View className="relative">
          <TextInput
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            value={confirm}
            onChangeText={setConfirm}
            className={`bg-white px-4 py-3 rounded-lg border ${!passwordsMatch && confirm ? 'border-red-500' : 'border-gray-300'} text-base pr-12`}
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: [{ translateY: -12 }],
            }}
            onPress={toggleConfirmPasswordVisibility}
          >
            <MaterialCommunityIcons
              name={showConfirmPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>
        {!passwordsMatch && confirm && (
          <Text className="text-red-500 text-xs mt-1">Passwords do not match</Text>
        )}
      </View>
      
      <View className="mb-6">
        <Text className="text-sm font-medium text-gray-700 mb-2">Password Requirements</Text>
        <View className="flex-row flex-wrap gap-2 mb-4">
          {Object.entries(validations).map(([key, valid]) => (
            <View key={key} className={`flex-row items-center px-3 py-2 rounded-full ${valid ? 'bg-green-100' : 'bg-gray-100'}`}>
              <MaterialCommunityIcons 
                name={valid ? 'check-circle' : 'alert-circle-outline'} 
                size={16} 
                color={valid ? '#10B981' : '#9CA3AF'} 
                style={{ marginRight: 4 }}
              />
              <Text className={`text-xs capitalize ${valid ? 'text-green-700' : 'text-gray-500'}`}>
                {key === 'length' ? '8+ characters' : 
                 key === 'upper' ? 'Uppercase' : 
                 key === 'lower' ? 'Lowercase' : 
                 key === 'special' ? 'Special char' : 'Number'}
              </Text>
            </View>
          ))}
        </View>
      </View>
      
      <View className="flex-row items-center space-x-2 mb-4">
        <Checkbox value={updatesOptIn} onValueChange={setUpdatesOptIn} color={updatesOptIn ? '#2563EB' : undefined} />
        <Text className="text-gray-700">I agree to receive product updates and announcements</Text>
      </View>
      
      <View className="flex-row items-center space-x-2 mb-6">
        <Checkbox value={agree} onValueChange={setAgree} color={agree ? '#2563EB' : undefined} />
        <Text className="text-gray-700">
          I agree to the <Text className="text-blue-600">Terms of Use</Text> and <Text className="text-blue-600">Privacy Policy</Text>
        </Text>
      </View>
      
      <TouchableOpacity
        onPress={handleRegister}
        disabled={!allValid || isLoading}
        style={{
          padding: 16,
          borderRadius: 9999,
          backgroundColor: allValid && !isLoading ? '#2563EB' : '#D1D5DB'
        }}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-white text-center font-semibold">Continue</Text>
        )}
      </TouchableOpacity>
      
      <ErrorModal
        visible={showError}
        error={errorMessage}
        onClose={() => setShowError(false)}
      />
    </ScrollView>
  );
}