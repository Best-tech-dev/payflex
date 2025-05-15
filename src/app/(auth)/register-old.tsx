import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { ErrorModal } from '@/components/common/ErrorModal';
import { useAuth } from '@/contexts/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { register } = useAuth();

  const validateForm = () => {
    if (!firstName || !lastName || !email || !password) {
      setErrorMessage('Please fill in all fields');
      return false;
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      await register(firstName, lastName, email, password);
      router.replace({
        pathname: '/(auth)/otp-verification',
        params: { email },
      });
    } catch (error: any) {
      setErrorMessage(error?.message || 'Registration failed');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.replace('/login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1">
              <View className="flex-1 p-5 justify-center min-h-[550px]">
                {/* Header */}
                <View className="items-center mb-8">
                  <Image
                    source={require('@/assets/images/best-tech.png')}
                    style={{ width: 80, height: 80, marginBottom: 16 }}
                  />
                  <Text className="text-2xl font-semibold text-gray-900 mb-2">
                    Create Account
                  </Text>
                  <Text className="text-base text-gray-500">
                    Sign up to get started!
                  </Text>
                </View>

                {/* Form */}
                <View className="space-y-4">
                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </Text>
                    <TextInput
                      value={firstName}
                      onChangeText={setFirstName}
                      placeholder="Enter your first name"
                      autoCapitalize="words"
                      className="bg-white px-4 py-3 rounded-full border border-gray-300 text-base"
                    />
                  </View>

                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </Text>
                    <TextInput
                      value={lastName}
                      onChangeText={setLastName}
                      placeholder="Enter your last name"
                      autoCapitalize="words"
                      className="bg-white px-4 py-3 rounded-full border border-gray-300 text-base"
                    />
                  </View>

                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Email
                    </Text>
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="bg-white px-4 py-3 rounded-full border border-gray-300 text-base"
                    />
                  </View>

                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">
                      Password
                    </Text>
                    <View className="relative">
                      <TextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Create a password"
                        secureTextEntry={!showPassword}
                        className="bg-white px-4 py-3 rounded-full border border-gray-300 text-base pr-12"
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

                  <Button
                    title="Create Account"
                    onPress={handleRegister}
                    loading={isLoading}
                  />
                </View>

                {/* Footer */}
                <View className="mt-8 flex-row justify-center items-center space-x-2">
                  <Text className="text-sm text-gray-500">
                    Already have an account?
                  </Text>
                  <TouchableOpacity onPress={handleLogin}>
                    <Text className="text-sm font-semibold text-blue-600">
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>

      <ErrorModal
        visible={showError}
        error={errorMessage}
        onClose={() => setShowError(false)}
      />
    </SafeAreaView>
  );
}