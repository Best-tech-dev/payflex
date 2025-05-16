// File: src/app/(auth)/register/Step3.tsx
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import Checkbox from 'expo-checkbox';
import { useRegister } from '@/contexts/RegisterContexts';
import { useAuth } from '@/contexts/AuthContext';
import { MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { ErrorModal } from '@/components/common/ErrorModal';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

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
  const { formData, updateForm, clearForm } = useRegister();
  const { register } = useAuth();
  const [password, setPassword] = useState(formData.password || '');
  const [confirm, setConfirm] = useState(formData.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [updatesOptIn, setUpdatesOptIn] = useState(formData.updatesOptIn || false);
  const [agreeToTerms, setAgreeToTerms] = useState(formData.agree || false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  
  const validations = validatePassword(password);
  const passwordsMatch = password === confirm;
  const allValid = Object.values(validations).every(Boolean) && passwordsMatch && agreeToTerms;
  
  // Calculate overall password strength
  const passwordStrength = Object.values(validations).filter(Boolean).length;
  
  const getPasswordStrengthLabel = () => {
    if (passwordStrength <= 2) return { label: 'Weak', color: '#EF4444' };
    if (passwordStrength <= 4) return { label: 'Medium', color: '#F59E0B' };
    return { label: 'Strong', color: '#10B981' };
  };
  
  const strengthInfo = getPasswordStrengthLabel();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle registration with backend
  const handleRegister = async () => {
    if (!allValid) return;
    
    try {
      setIsLoading(true);
      
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
        updatesOptIn: updatesOptIn,
        agreeToTerms: agreeToTerms
      };
      
      await register(registrationData);
      
      // Update form data before navigating
      updateForm({ password, updatesOptIn, agreeToTerms });
      
    } catch (error: any) {
      setErrorMessage(error?.message || 'Registration failed');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <StatusBar style="dark" />
      <ScrollView className="flex-1 bg-white">
        <View className="px-6">
          {/* Logo and Company Name could go here */}
          <View className="items-center mb-6">
            {/* <YourLogoComponent /> */}
          </View>

          {/* Progress indicator */}
          <View className="flex-row justify-between mb-4 mt-2">
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
          
          <View className="mb-8">
            <Text className="text-2xl font-bold text-gray-800 mb-2">Set Up Your Password</Text>
            <Text className="text-base text-gray-500">Create a secure password to protect your account</Text>
          </View>
          
          {/* Password Field */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Password</Text>
            <View className={`relative border rounded-xl overflow-hidden ${
              passwordFocused ? 'border-blue-500 shadow-sm' : 'border-gray-300'
            }`}>
              <View className="flex-row items-center bg-white">
                <View className="pl-4 py-3">
                  <Feather name="lock" size={20} color={passwordFocused ? "#2563EB" : "#9CA3AF"} />
                </View>
                <TextInput
                  placeholder="Create a strong password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  className="flex-1 py-3.5 pl-2 pr-12 text-gray-800 text-base"
                />
                <TouchableOpacity
                  style={{ position: 'absolute', right: 12, top: 14 }}
                  onPress={togglePasswordVisibility}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={22}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>
            </View>
            
            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <View className="mt-2">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-xs text-gray-500">Password Strength</Text>
                  <Text className="text-xs font-medium" style={{ color: strengthInfo.color }}>
                    {strengthInfo.label}
                  </Text>
                </View>
                <View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <View 
                    className="h-full"
                    style={{ 
                      width: `${(passwordStrength / 5) * 100}%`,
                      backgroundColor: strengthInfo.color 
                    }}
                  />
                </View>
              </View>
            )}
          </View>
          
          {/* Confirm Password Field */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-2">Confirm Password</Text>
            <View className={`relative border rounded-xl overflow-hidden ${
              confirmFocused ? 'border-blue-500 shadow-sm' : 
              (!passwordsMatch && confirm) ? 'border-red-500' : 'border-gray-300'
            }`}>
              <View className="flex-row items-center bg-white">
                <View className="pl-4 py-3">
                  <Feather 
                    name="shield" 
                    size={20} 
                    color={
                      confirmFocused ? "#2563EB" : 
                      (!passwordsMatch && confirm) ? "#EF4444" : "#9CA3AF"
                    } 
                  />
                </View>
                <TextInput
                  placeholder="Confirm your password"
                  secureTextEntry={!showConfirmPassword}
                  value={confirm}
                  onChangeText={setConfirm}
                  onFocus={() => setConfirmFocused(true)}
                  onBlur={() => setConfirmFocused(false)}
                  className="flex-1 py-3.5 pl-2 pr-12 text-gray-800 text-base"
                />
                <TouchableOpacity
                  style={{ position: 'absolute', right: 12, top: 14 }}
                  onPress={toggleConfirmPasswordVisibility}
                >
                  <MaterialCommunityIcons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={22}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>
            </View>
            {!passwordsMatch && confirm && (
              <Text className="text-red-500 text-xs mt-1 flex-row items-center">
                <MaterialCommunityIcons name="alert-circle" size={14} color="#EF4444" />
                <Text> Passwords do not match</Text>
              </Text>
            )}
          </View>
          
          {/* Password Requirements */}
          <View className="mb-4 bg-gray-50 p-4 rounded-xl">
            <Text className="text-sm font-semibold text-gray-700 mb-3">Password Requirements</Text>
            <View className="space-y-2">
              {Object.entries(validations).map(([key, valid]) => (
                <View key={key} className="flex-row items-center">
                  <View className={`w-5 h-5 rounded-full ${valid ? 'bg-green-100' : 'bg-gray-200'} items-center justify-center mr-3`}>
                    <MaterialCommunityIcons 
                      name={valid ? 'check' : 'minus'} 
                      size={14} 
                      color={valid ? '#10B981' : '#9CA3AF'} 
                    />
                  </View>
                  <Text className={`text-sm ${valid ? 'text-gray-800' : 'text-gray-500'}`}>
                    {key === 'length' ? 'At least 8 characters' : 
                     key === 'upper' ? 'At least one uppercase letter (A-Z)' : 
                     key === 'lower' ? 'At least one lowercase letter (a-z)' : 
                     key === 'special' ? 'At least one special character (!@#$...)' : 
                     'At least one number (0-9)'}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Consent Checkboxes */}
          <View className="space-y-2 mb-4">
            <View className="flex-row items-start space-x-3">
              <Checkbox 
                value={updatesOptIn} 
                onValueChange={setUpdatesOptIn} 
                color={updatesOptIn ? '#2563EB' : undefined}
                style={{ marginTop: 2 }}
              />
              <Text className="text-gray-700 flex-1 text-sm">
                I would like to receive product updates, promotions, and news via email.
                You can unsubscribe at any time.
              </Text>
            </View>
            
            <View className="flex-row items-start space-x-3">
              <Checkbox 
                value={agreeToTerms} 
                onValueChange={setAgreeToTerms} 
                color={agreeToTerms ? '#2563EB' : undefined}
                style={{ marginTop: 2 }}
              />
              <Text className="text-gray-700 flex-1 text-sm">
                I agree to the <Text className="text-blue-600 font-medium">Terms of Service</Text> and 
                <Text className="text-blue-600 font-medium"> Privacy Policy</Text>
              </Text>
            </View>
          </View>
          
          {/* Continue Button */}
          <TouchableOpacity
            onPress={handleRegister}
            disabled={!allValid || isLoading}
            style={[
              { borderRadius: 12, overflow: 'hidden' },
              (!allValid || isLoading) && { opacity: 0.7 }
            ]}
          >
            <LinearGradient
              colors={['#2563EB', '#1E40AF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="py-4 px-6"
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white text-center font-semibold text-base">
                  Create Account
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => router.back()}
            style={{ marginTop: 16, paddingVertical: 12 }}
          >
            <Text className="text-center text-gray-600 font-medium">
              Back to Previous Step
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <ErrorModal
        visible={showError}
        error={errorMessage}
        onClose={() => setShowError(false)}
      />
    </KeyboardAvoidingView>
  );
}