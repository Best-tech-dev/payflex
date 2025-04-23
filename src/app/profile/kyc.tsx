import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { Loader } from '@/components/Loader';
import { SuccessModal } from '@/components/SuccessModal';
import { ErrorModal } from '@/components/ErrorModal';
import { colors } from '@/constants/theme';
import { api } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';
import { Select } from '@/components/common/Select';
import { Input } from '@/components/Input';

// Document type options
const documentTypes = [
  { label: 'BVN Verification', value: 'NIGERIAN_BVN_VERIFICATION', disabled: false },
  { label: 'NIN', value: 'NIGERIAN_NIN', disabled: true },
  { label: 'International Passport', value: 'NIGERIAN_INTERNATIONAL_PASSPORT', disabled: true },
  { label: 'PVC', value: 'NIGERIAN_PVC', disabled: true },
];

export default function KYCScreen() {
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [documentType, setDocumentType] = useState('NIGERIAN_BVN_VERIFICATION');
  const [documentNumber, setDocumentNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [appData, setAppData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const cachedData = await AsyncStorage.getItem('appDetails');
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setAppData(parsedData);
        }
      } catch (error) {
        console.error('Error loading cached data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCachedData();
  }, []);

  const handleSubmit = async () => {
    
    setIsLoading(true);

    try {
      const res = await api.user.updateKYC(documentType, documentNumber);

      if(res.success) {
        setShowSuccess(true);
        setIsLoading(false);
      } else {
        setErrorMessage(res.message);
        setShowError(true);
        setIsLoading(false);
      }

    } catch (error: any) {
      setErrorMessage(error.message);
      setShowError(true);
      setIsLoading(false);
    }
  };

  // const handleUploadImage = (type: 'front' | 'back' | 'selfie') => {
  //   // In a real app, this would open the image picker
  //   // For now, we'll simulate with a timeout
  //   setIsLoading(true);
    
  //   setTimeout(() => {
  //     // Mock image URL
  //     const mockImageUrl = 'https://via.placeholder.com/300x200';
      
  //     if (type === 'front') {
  //       setFrontImage(mockImageUrl);
  //     } else if (type === 'back') {
  //       setBackImage(mockImageUrl);
  //     } else {
  //       setSelfieImage(mockImageUrl);
  //     }
      
  //     setIsLoading(false);
  //   }, 1000);
  // };

  // Add validation function
  const isFormValid = () => {
    return documentNumber.trim().length === 11 && agreeToTerms;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>BVN Verification</Text>
          <Text style={styles.stepDescription}>
            Please provide your BVN for verification
          </Text>
          
          <Input
            label="BVN Number"
            value={documentNumber}
            onChangeText={setDocumentNumber}
            placeholder="Enter your BVN"
            keyboardType="numeric"
            maxLength={11}
          />

          <View style={styles.termsContainer}>
            <TouchableOpacity 
              style={styles.termsCheckbox}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              <MaterialCommunityIcons 
                name={agreeToTerms ? "checkbox-marked" : "checkbox-blank-outline"} 
                size={24} 
                color={agreeToTerms ? colors.primary.main : colors.text.secondary} 
              />
              <Text style={styles.termsText}>
                I agree to the Terms of Service and Conditions
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => router.back()}
            style={styles.backButton}
          />
          <Button
            title="Verify"
            onPress={handleSubmit}
            style={{
              ...styles.nextButton,
              backgroundColor: !isFormValid() ? '#E5E7EB' : colors.primary.main
            }}
            disabled={!isFormValid()}
          />
        </View>
      </ScrollView>

      {/* Loading Modal */}
      <Loader visible={isLoading} message="Processing..." />

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccess}
        title="Verification Submitted"
        message="Your BVN verification has been submitted successfully. We'll notify you once it's approved."
        onClose={() => setShowSuccess(false)}
      />

      {/* Error Modal */}
      <ErrorModal
        visible={showError}
        title="Verification Error"
        message={errorMessage}
        onClose={() => setShowError(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  step: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: colors.primary.main,
  },
  stepText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeStepText: {
    color: 'white',
  },
  stepLine: {
    width: 60,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  activeStepLine: {
    backgroundColor: colors.primary.main,
  },
  stepContent: {
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  infoContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  imageUploadContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  imageUpload: {
    width: '48%',
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  selfieContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  selfieUpload: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  uploadedSelfie: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    flex: 1,
    marginRight: 12,
  },
  nextButton: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: colors.primary.main,
  },
  termsContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  termsCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  termsText: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text.secondary,
  },
}); 