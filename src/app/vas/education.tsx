import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { Loader } from '@/components/Loader';
import { SuccessModal } from '@/components/SuccessModal';
import { router } from 'expo-router';

// Mock data for education providers
const EDUCATION_PROVIDERS = [
  { id: '1', name: 'WAEC', code: 'WAEC', icon: 'school' as const },
  { id: '2', name: 'NECO', code: 'NECO', icon: 'school' as const },
  { id: '3', name: 'JAMB', code: 'JAMB', icon: 'school' as const },
  { id: '4', name: 'LASU', code: 'LASU', icon: 'school' as const },
  { id: '5', name: 'UNILAG', code: 'UNILAG', icon: 'school' as const },
  { id: '6', name: 'UNIBEN', code: 'UNIBEN', icon: 'school' as const },
];

// Mock data for education services
const EDUCATION_SERVICES = {
  WAEC: [
    { id: '1', name: 'Registration', price: 15000 },
    { id: '2', name: 'Result Checker', price: 2500 },
    { id: '3', name: 'Certificate Verification', price: 5000 },
  ],
  NECO: [
    { id: '1', name: 'Registration', price: 12000 },
    { id: '2', name: 'Result Checker', price: 2000 },
    { id: '3', name: 'Certificate Verification', price: 4500 },
  ],
  JAMB: [
    { id: '1', name: 'Registration', price: 5000 },
    { id: '2', name: 'Result Checker', price: 1500 },
    { id: '3', name: 'Change of Course', price: 2500 },
    { id: '4', name: 'Change of Institution', price: 2500 },
  ],
  LASU: [
    { id: '1', name: 'Tuition Fee', price: 150000 },
    { id: '2', name: 'Acceptance Fee', price: 25000 },
    { id: '3', name: 'Development Levy', price: 15000 },
    { id: '4', name: 'Library Fee', price: 5000 },
  ],
  UNILAG: [
    { id: '1', name: 'Tuition Fee', price: 180000 },
    { id: '2', name: 'Acceptance Fee', price: 30000 },
    { id: '3', name: 'Development Levy', price: 20000 },
    { id: '4', name: 'Library Fee', price: 5000 },
  ],
  UNIBEN: [
    { id: '1', name: 'Tuition Fee', price: 160000 },
    { id: '2', name: 'Acceptance Fee', price: 28000 },
    { id: '3', name: 'Development Levy', price: 18000 },
    { id: '4', name: 'Library Fee', price: 5000 },
  ],
};

// Mock student data
const MOCK_STUDENTS = {
  '1234567890': { name: 'John Doe', school: 'UNILAG', level: '300 Level', department: 'Computer Science', balance: 50000 },
  '9876543210': { name: 'Jane Smith', school: 'LASU', level: '200 Level', department: 'Business Administration', balance: 35000 },
  '5555555555': { name: 'Michael Johnson', school: 'UNIBEN', level: '400 Level', department: 'Electrical Engineering', balance: 45000 },
  '1111111111': { name: 'Sarah Williams', school: 'WAEC', level: 'SS3', department: 'Science', balance: 15000 },
  '2222222222': { name: 'David Brown', school: 'NECO', level: 'SS3', department: 'Arts', balance: 12000 },
  '3333333333': { name: 'Emily Davis', school: 'JAMB', level: 'UTME', department: 'All', balance: 5000 },
};

const schools = [
  { id: 'unilag', name: 'University of Lagos', icon: 'school' },
  { id: 'uniben', name: 'University of Benin', icon: 'school' },
  { id: 'unilorin', name: 'University of Ilorin', icon: 'school' },
  { id: 'lasu', name: 'Lagos State University', icon: 'school' },
];

const feeTypes = [
  { id: 'tuition', name: 'Tuition Fee', amount: 150000 },
  { id: 'accommodation', name: 'Accommodation', amount: 50000 },
  { id: 'library', name: 'Library Fee', amount: 10000 },
  { id: 'sports', name: 'Sports Fee', amount: 5000 },
];

export default function Education() {
  const [selectedSchool, setSelectedSchool] = useState(schools[0]);
  const [studentId, setStudentId] = useState('');
  const [selectedFeeType, setSelectedFeeType] = useState(feeTypes[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const handleSchoolSelect = (school: typeof schools[0]) => {
    setSelectedSchool(school);
  };

  const handleStudentIdChange = (text: string) => {
    setStudentId(text);
    if (text.length === 10) {
      // Mock verification
      setIsLoading(true);
      setTimeout(() => {
        setStudentName('John Doe');
        setIsVerified(true);
        setIsLoading(false);
      }, 1500);
    } else {
      setIsVerified(false);
      setStudentName('');
    }
  };

  const handleProceed = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* School Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select School</Text>
          <View style={styles.providerGrid}>
            {schools.map((school) => (
              <TouchableOpacity
                key={school.id}
                style={[
                  styles.providerCard,
                  selectedSchool.id === school.id && styles.selectedProvider,
                ]}
                onPress={() => handleSchoolSelect(school)}
              >
                <MaterialCommunityIcons
                  name={school.icon as any}
                  size={24}
                  color={selectedSchool.id === school.id ? colors.primary.main : '#6B7280'}
                />
                <Text
                  style={[
                    styles.providerName,
                    selectedSchool.id === school.id && styles.selectedProviderText,
                  ]}
                >
                  {school.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Student ID Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Enter Student ID</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter 10-digit student ID"
              value={studentId}
              onChangeText={handleStudentIdChange}
              keyboardType="numeric"
              maxLength={10}
            />
            {isVerified && (
              <View style={styles.verifiedContainer}>
                <MaterialCommunityIcons name="check-circle" size={20} color={colors.success} />
                <Text style={styles.verifiedText}>{studentName}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Fee Type Selection */}
        {isVerified && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Fee Type</Text>
            <View style={styles.feeGrid}>
              {feeTypes.map((fee) => (
                <TouchableOpacity
                  key={fee.id}
                  style={[
                    styles.feeCard,
                    selectedFeeType.id === fee.id && styles.selectedFee,
                  ]}
                  onPress={() => setSelectedFeeType(fee)}
                >
                  <Text style={styles.feeName}>{fee.name}</Text>
                  <Text style={styles.feeAmount}>₦{fee.amount.toLocaleString()}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.proceedButton}
              onPress={handleProceed}
              disabled={!isVerified}
            >
              <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Loading Modal */}
      {isLoading && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <MaterialCommunityIcons name="loading" size={40} color={colors.primary.main} />
            <Text style={styles.modalText}>Processing...</Text>
          </View>
        </View>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <MaterialCommunityIcons name="check-circle" size={40} color={colors.success} />
            <Text style={styles.modalText}>Payment Successful!</Text>
          </View>
        </View>
      )}
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  providerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  providerCard: {
    width: '47%',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedProvider: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light,
  },
  providerName: {
    marginTop: 8,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  selectedProviderText: {
    color: colors.primary.main,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 16,
  },
  verifiedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  verifiedText: {
    marginLeft: 8,
    color: colors.success,
    fontSize: 14,
  },
  feeGrid: {
    gap: 12,
  },
  feeCard: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedFee: {
    borderColor: colors.primary.main,
    backgroundColor: colors.primary.light,
  },
  feeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  feeAmount: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  proceedButton: {
    backgroundColor: colors.primary.main,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  proceedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalText: {
    marginTop: 16,
    fontSize: 16,
    color: '#111827',
    textAlign: 'center',
  },
}); 