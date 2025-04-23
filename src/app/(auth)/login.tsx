import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Keyboard, TextInput as RNTextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { TextInput } from '@/components/common/TextInput';
import { Button } from '@/components/Button';
import { ErrorModal } from '@/components/common/ErrorModal';
import { Loader } from '@/components/Loader';
import { useAuth } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { styled } from 'nativewind';
import { TouchableWithoutFeedback } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  image: {
    width: 96,
    height: 96,
    resizeMode: 'contain',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12, 
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  }
});

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      setShowError(true);
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
      // Navigation will be handled by the AuthProvider
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Login failed');
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    router.push('/(auth)/register');
  };

  const clearAppData = async () => {
    try {
      // Clear all AsyncStorage data
      await AsyncStorage.clear();
  
      Alert.alert(
        'Success',
        'App data cleared. Restart the app to see the onboarding screen.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Optionally, you can force the app to navigate to onboarding
              router.replace('/onboarding');
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error clearing app data:', error);
      Alert.alert('Error', 'Failed to clear app data');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const StyledSafeAreaView = styled(SafeAreaView);
  const StyledView = styled(View);
  const StyledText = styled(Text);
  const StyledImage = styled(Image);
  const StyledTouchableOpacity = styled(TouchableOpacity);
  const StyledLinearGradient = styled(LinearGradient);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <LinearGradient
              colors={['#ffffff', '#f3f4f6']}
              style={{ flex: 1 }}
            >
              <View style={styles.content}>
                <View style={{ alignItems: 'center', marginBottom: 48 }}>
                  <Image
                    source={require('@/assets/images/best-tech.png')}
                    style={styles.image}
                  />
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827', marginTop: 24, marginBottom: 8 }}>
                    Welcome
                  </Text>
                  <Text style={{ fontSize: 16, color: '#6B7280' }}>
                    Sign in to continue
                  </Text>
                </View>

                <View style={{ gap: 6 }}>
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6 }}>
                      Email
                    </Text>
                    <RNTextInput
                      value={email}
                      onChangeText={setEmail}
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={styles.input}
                    />
                  </View>

                  <View>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6 }}>
                      Password
                    </Text>
                    <View style={{ position: 'relative' }}>
                      <RNTextInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
                        secureTextEntry={!showPassword}
                        style={styles.input}
                      />
                      <TouchableOpacity 
                        style={{ position: 'absolute', right: 16, top: '50%', transform: [{ translateY: -12 }] }}
                        onPress={togglePasswordVisibility}
                      >
                        <MaterialCommunityIcons 
                          name={showPassword ? "eye-off" : "eye"} 
                          size={24} 
                          color="#6B7280"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={{ alignSelf: 'flex-end' }}
                    onPress={() => router.push('/(auth)/forgot-password')}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#2563EB' }}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, { marginTop: 8 }]}
                    onPress={handleLogin}
                    disabled={isLoading}
                  >
                    <Text style={{ fontSize: 16, fontWeight: '600', color: 'white' }}>
                      {isLoading ? 'Signing in...' : 'Sign In'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 32 }}>
                  <Text style={{ color: '#6B7280' }}>
                    Don't have an account?
                  </Text>
                  <TouchableOpacity onPress={handleRegister} style={{ marginLeft: 4 }}>
                    <Text style={{ color: '#2563EB', fontWeight: '600' }}>
                      Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Development only - remove in production */}
                {__DEV__ && (
                  <TouchableOpacity 
                    style={{ 
                      marginTop: 32, 
                      paddingVertical: 8, 
                      paddingHorizontal: 16, 
                      backgroundColor: '#FEE2E2', 
                      borderRadius: 8, 
                      alignSelf: 'center' 
                    }}
                    onPress={clearAppData}
                  >
                    <Text style={{ color: '#DC2626', fontSize: 14, fontWeight: '500' }}>
                      Clear App Data (Testing)
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </LinearGradient>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>

      <ErrorModal
        visible={showError}
        error={errorMessage}
        onClose={() => setShowError(false)}
      />

      <Loader 
        visible={isLoading}
        message="Signing in..."
      />
    </SafeAreaView>
  );
}