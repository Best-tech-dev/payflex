import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/common/Select';
import { Loader } from '@/components/Loader';
import { SuccessModal } from '@/components/SuccessModal';
import { ErrorModal } from '@/components/ErrorModal';
import { colors } from '@/constants/theme';

// Document type options
const documentTypes = [
  { label: 'National ID', value: 'national_id' },
  { label: 'International Passport', value: 'passport' },
  { label: 'Driver\'s License', value: 'drivers_license' },
  { label: 'Voter\'s Card', value: 'voters_card' },
];

export default function KYCScreen() {
  const [step, setStep] = useState(1);
  const [documentType, setDocumentType] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [selfieImage, setSelfieImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleUploadImage = (type: 'front' | 'back' | 'selfie') => {
    // In a real app, this would open the image picker
    // For now, we'll simulate with a timeout
    setIsLoading(true);
    
    setTimeout(() => {
      // Mock image URL
      const mockImageUrl = 'https://via.placeholder.com/300x200';
      
      if (type === 'front') {
        setFrontImage(mockImageUrl);
      } else if (type === 'back') {
        setBackImage(mockImageUrl);
      } else {
        setSelfieImage(mockImageUrl);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleSubmit = () => {
    // Validate all required fields
    if (!documentType || !documentNumber || !expiryDate || !frontImage || !backImage || !selfieImage) {
      setErrorMessage('Please complete all required fields');
      setShowError(true);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      
      // Hide success message after 2 seconds and go back
      setTimeout(() => {
        setShowSuccess(false);
        router.back();
      }, 2000);
    }, 2000);
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((s) => (
        <View key={s} style={styles.stepContainer}>
          <View style={[styles.step, s === step ? styles.activeStep : null]}>
            <Text style={[styles.stepText, s === step ? styles.activeStepText : null]}>
              {s}
            </Text>
          </View>
          {s < 3 && (
            <View style={[styles.stepLine, s < step ? styles.activeStepLine : null]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Document Information</Text>
            <Text style={styles.stepDescription}>
              Please provide your identification document details
            </Text>
            
            <Select
              label="Document Type"
              value={documentType}
              options={documentTypes}
              onChange={setDocumentType}
              placeholder="Select document type"
            />
            
            <Input
              label="Document Number"
              value={documentNumber}
              onChangeText={setDocumentNumber}
              placeholder="Enter document number"
            />
            
            <Input
              label="Expiry Date"
              value={expiryDate}
              onChangeText={setExpiryDate}
              placeholder="YYYY-MM-DD"
            />
          </View>
        );
      
      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Document Images</Text>
            <Text style={styles.stepDescription}>
              Please upload clear images of your identification document
            </Text>
            
            <View style={styles.imageUploadContainer}>
              <TouchableOpacity
                style={styles.imageUpload}
                onPress={() => handleUploadImage('front')}
              >
                {frontImage ? (
                  <Image source={{ uri: frontImage }} style={styles.uploadedImage} />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <MaterialCommunityIcons name="camera" size={32} color={colors.primary.main} />
                    <Text style={styles.uploadText}>Front of Document</Text>
                  </View>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.imageUpload}
                onPress={() => handleUploadImage('back')}
              >
                {backImage ? (
                  <Image source={{ uri: backImage }} style={styles.uploadedImage} />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <MaterialCommunityIcons name="camera" size={32} color={colors.primary.main} />
                    <Text style={styles.uploadText}>Back of Document</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );
      
      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Selfie Verification</Text>
            <Text style={styles.stepDescription}>
              Please take a selfie to verify your identity
            </Text>
            
            <View style={styles.selfieContainer}>
              <TouchableOpacity
                style={styles.selfieUpload}
                onPress={() => handleUploadImage('selfie')}
              >
                {selfieImage ? (
                  <Image source={{ uri: selfieImage }} style={styles.uploadedSelfie} />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <MaterialCommunityIcons name="face-man" size={32} color={colors.primary.main} />
                    <Text style={styles.uploadText}>Take Selfie</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {renderStepIndicator()}
        {renderStepContent()}
        
        <View style={styles.buttonContainer}>
          <Button
            title={step === 1 ? "Cancel" : "Back"}
            variant="outline"
            onPress={handleBack}
            style={styles.backButton}
          />
          <Button
            title={step === 3 ? "Submit" : "Next"}
            onPress={handleNext}
            style={styles.nextButton}
          />
        </View>
      </ScrollView>

      {/* Loading Modal */}
      <Loader visible={isLoading} message="Processing..." />

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccess}
        title="Verification Submitted"
        message="Your KYC verification has been submitted successfully. We'll notify you once it's approved."
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
  },
}); 