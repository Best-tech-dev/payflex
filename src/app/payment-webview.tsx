import React, { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator, BackHandler, Alert, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/services/api';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledSafeAreaView = styled(SafeAreaView);

export default function PaymentWebView() {
  const [isAlreadyVerified, setIsAlreadyVerified] = useState(false);
  const [verified, setVerified] = useState(false);
  const [newBalance, setNewBalance] = useState<number>(0);
  const router = useRouter();
  const params = useLocalSearchParams();
  const { url, reference } = params;
  const paymentUrl = Array.isArray(url) ? url[0] : url;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const webViewRef = useRef<WebView | null>(null);
  const retryCount = useRef(0);
  const maxRetries = 3;

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert(
        'Cancel Payment',
        'Are you sure you want to cancel this payment? Your transaction may still be processing.',
        [
          { text: 'Stay', onPress: () => null, style: 'cancel' },
          { text: 'Cancel Payment', onPress: () => handleCancelPayment() }
        ]
      );
      return true;
    });

    return () => backHandler.remove();
  }, []);

  const handleCancelPayment = async () => {
    try {
      if (reference) {
        // Optional: Call an API to cancel the payment
      }
      await AsyncStorage.removeItem('pendingPaymentRef');
      router.back();
    } catch (error) {
      console.error('Error canceling payment:', error);
      router.back();
    }
  };

  const verifyPayment = async (ref: string) => {
    setVerifying(true);
  
    try {
      console.log("Verifying paystack payment...");
      const verificationResult = await api.wallet.verifyPaystackPayment(ref);

      // console.log("Verification result:", verificationResult);
  
      if (verificationResult.success) {

        console.log("Payment verified successfully:");

        setNewBalance(verificationResult.data?.balance || 0);

        console.log('✅ Payment verified. Will redirect shortly...');
        await AsyncStorage.removeItem('pendingPaymentRef');
  
        setVerified(true); // Trigger redirect in useEffect
      } else {
        if (retryCount.current < maxRetries) {
          retryCount.current += 1;
          setTimeout(() => verifyPayment(ref), 2000);
        } else {
          throw new Error(verificationResult.message || 'Verification failed after multiple attempts');
        }
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'Payment verification failed');
      Alert.alert(
        'Payment Verification Error',
        'We couldn\'t verify your payment status. Your account will be credited automatically if payment was successful.',
        [
          { text: 'Check Status Later', onPress: () => router.back() },
          { text: 'Contact Support', onPress: () => router.push('/support') }
        ]
      );
    } finally {
      setVerifying(false);
    }
  };

  // useEffect to navigate after verification
useEffect(() => {
  if (verified || isAlreadyVerified) {
    console.log('🚀 Redirecting to Home now...');
    router.replace({
      pathname: '/(app)/home',
      params: { 
        paymentSuccess: 'true',
        message: 'Payment completed successfully',
        newBalance: newBalance
      }
    });
  }
}, [verified]);

  // Optionally poll Paystack to auto-verify in background
  // useEffect(() => {
  //   const poller = setInterval(() => {
  //     if (reference && !verifying) verifyPayment(reference as string);
  //   }, 15000);
  //   return () => clearInterval(poller);
  // }, []);

  // Log navigation for debugging
  const handleNavigationStateChange = (navState: { url: string | string[]; }) => {
    console.log('Navigated to:', navState.url);

  // Check if the URL indicates payment completion
  if (navState.url.includes('http://localhost:1000/api/v1') && !isAlreadyVerified) {
    console.log('Payment completed. Verifying...');
    setIsAlreadyVerified(true); // Prevent duplicate verification

    router.replace({
      pathname: '/(app)/home',
      params: {
        paymentSuccess: 'true',
        message: 'Payment completed successfully',
        newBalance: newBalance
      }
    });

    // if (verified || isAlreadyVerified) {
    //   console.log('🚀 Redirecting to Home now...');
    //   router.replace({
    //     pathname: '/(app)/home',
    //     params: { 
    //       paymentSuccess: 'true',
    //       message: 'Payment completed successfully',
    //       newBalance: newBalance
    //     }
    //   });
    // }
    
    // verifyPayment(reference as string);
  }
    // No need to verify based on URL – handled manually now
  };

  const handleWebViewError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    setError(nativeEvent.description || 'Failed to load payment page');
    setLoading(false);
  };

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />

      {loading && (
        <StyledView className="absolute z-10 h-full w-full justify-center items-center bg-white">
          <ActivityIndicator size="large" color="#0066FF" />
          <StyledText className="mt-4 text-gray-600">Loading payment gateway...</StyledText>
        </StyledView>
      )}

      {verifying && (
        <StyledView className="absolute z-10 h-full w-full justify-center items-center bg-white/90">
          <ActivityIndicator size="large" color="#0066FF" />
          <StyledText className="mt-4 text-gray-600">Verifying your payment...</StyledText>
          <StyledText className="mt-2 text-sm text-gray-500">Please don't close the app</StyledText>
        </StyledView>
      )}

      {error ? (
        <StyledView className="flex-1 justify-center items-center p-6">
          <StyledText className="text-red-500 text-lg font-medium mb-4">Error Loading Payment</StyledText>
          <StyledText className="text-gray-700 mb-6 text-center">{error}</StyledText>
          <StyledTouchableOpacity 
            className="bg-blue-500 py-3 px-6 rounded-lg"
            onPress={() => {
              setError(null);
              setLoading(true);
              webViewRef.current?.reload();
            }}
          >
            <StyledText className="text-white font-medium">Try Again</StyledText>
          </StyledTouchableOpacity>
          <StyledTouchableOpacity 
            className="mt-4 py-3 px-6"
            onPress={() => router.back()}
          >
            <StyledText className="text-gray-600 font-medium">Go Back</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      ) : (
        <>
          <WebView
            ref={webViewRef}
            source={{ uri: paymentUrl }}
            onLoadEnd={() => setLoading(false)}
            onError={handleWebViewError}
            onHttpError={({ nativeEvent }) => {
              if (nativeEvent.statusCode >= 400) {
                setError(`Payment page error (${nativeEvent.statusCode})`);
              }
            }}
            onNavigationStateChange={handleNavigationStateChange}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            scalesPageToFit
            incognito={false}
          />

          {/* Manual verify button
          {!verifying && !loading && !error && (
          <StyledTouchableOpacity
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-blue-500 px-6 py-3 rounded-full z-20"
            onPress={() => {
              console.log('Manual verification triggered');
              verifyPayment(reference as string);
            }}
          >
            <StyledText className="text-white font-medium">I’ve Completed Payment</StyledText>
          </StyledTouchableOpacity>
        )} */}
        </>
      )}
    </StyledSafeAreaView>
  );
}
