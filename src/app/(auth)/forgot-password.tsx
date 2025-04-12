import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, TextInput as RNTextInput, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { TextInput } from '@/components/common/TextInput';
import { Button } from '@/components/Button';
import { ErrorModal } from '@/components/ErrorModal';
import { SuccessModal } from '@/components/SuccessModal';
import { Loader } from '@/components/Loader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { api } from '@/services/api';
import { styled } from 'nativewind';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);
const StyledText = styled(Text);

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showEmailError, setShowEmailError] = useState(false);
  const [showOtpError, setShowOtpError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateEmail = (email: string) => {
    return email.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleRequestOtp = async () => {
    if (!email) {
      setErrorMessage('Please enter your email address');
      setShowEmailError(true);
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      setShowEmailError(true);
      return;
    }

    setShowEmailError(false); // Clear any previous email errors
    // Remove any spaces from email
    const cleanEmail = email.trim();

    try {
      setIsLoading(true);
      setLoadingMessage('Requesting OTP...');
      await api.auth.sendOtpToEmail(cleanEmail);
      setEmail(cleanEmail); // Update state with clean email
      console.log('OTP sent successfully');
      setShowOtpModal(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send OTP');
      setShowEmailError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndReset = async () => {
    const cleanEmail = email.trim();

    if (!otp || !newPassword || !cleanEmail) {
      setErrorMessage('Email, OTP and new password are required');
      setShowOtpError(true);
      return;
    }

    try {
      setIsLoading(true);
      setLoadingMessage('Verifying OTP...');
      console.log("Data input: ", { email: cleanEmail, otp, newPassword });
      await api.auth.updatePassword(cleanEmail, otp, newPassword);
      setShowSuccess(true);
      setShowOtpModal(false);
      // After successful verification, navigate back to login
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 2000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to verify OTP');
      setShowOtpError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex1}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="flex-1"
        >
          <StyledView className="flex-1 px-6 justify-center">
            <StyledTouchableOpacity
              onPress={() => router.back()}
              className="absolute top-8 left-6"
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
            </StyledTouchableOpacity>

            <StyledText className="text-2xl font-bold text-gray-900 mb-2">Reset Password</StyledText>
            <StyledText className="text-base text-gray-600 mb-8">
              Enter your email address and we'll send you an OTP to reset your password.
            </StyledText>

            <StyledView className="space-y-6">
              <TextInput
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Button
                onPress={handleRequestOtp}
                title="Request Reset OTP"
                loading={isLoading}
              />
            </StyledView>
          </StyledView>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* OTP and New Password Modal */}
      <Modal
        transparent
        visible={showOtpModal}
        animationType="fade"
        onRequestClose={() => setShowOtpModal(false)}
      >
        <StyledView className="flex-1 items-center justify-center bg-black/50">
          <StyledView className="bg-white p-8 rounded-2xl items-center justify-center shadow-xl w-4/5">
            <StyledView className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center mb-4">
              <MaterialCommunityIcons name="key" size={32} color="#2563EB" />
            </StyledView>
            <StyledText className="text-gray-800 font-bold text-xl mb-2">Enter OTP</StyledText>
            <StyledText className="text-gray-600 text-center mb-6">
              Please enter the OTP sent to your email and your new password
            </StyledText>

            <StyledView className="w-full space-y-4 mb-4">
              <TextInput
                placeholder="Enter OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
              />
              <StyledView className="relative">
                <TextInput
                  placeholder="New Password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                />
                <StyledTouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-4"
                >
                  <MaterialCommunityIcons
                    name={showNewPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#9CA3AF"
                  />
                </StyledTouchableOpacity>
              </StyledView>
            </StyledView>

            <Button
              onPress={handleVerifyAndReset}
              title="Verify & Reset"
              loading={isLoading}
            />

            {/* Error display inside modal */}
            {showOtpError && (
              <StyledView className="mt-4 w-full bg-red-50 p-3 rounded-lg">
                <StyledText className="text-red-600 text-center">{errorMessage}</StyledText>
              </StyledView>
            )}
          </StyledView>
        </StyledView>
      </Modal>

      {/* Error Modal for email validation */}
      <ErrorModal
        visible={showEmailError}
        message={errorMessage}
        onClose={() => setShowEmailError(false)}
      />

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccess}
        title="Password Reset Successful"
        message="Your password has been reset successfully. You can now login with your new password."
        onClose={() => setShowSuccess(false)}
      />

      {/* Loader */}
      <Loader visible={isLoading} message={loadingMessage} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1
  }
});