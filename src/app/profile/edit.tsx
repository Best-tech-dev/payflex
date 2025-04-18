import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { api } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/common/Select';
import { Loader } from '@/components/Loader';

// KYC ID Types
const KYC_ID_TYPES = [
  { label: 'BVN Verification', value: 'NIGERIAN_BVN_VERIFICATION', disabled: false },
  { label: 'NIN', value: 'NIGERIAN_NIN', disabled: true },
  { label: 'International Passport', value: 'NIGERIAN_INTERNATIONAL_PASSPORT', disabled: true },
  { label: 'PVC', value: 'NIGERIAN_PVC', disabled: true },
];

export default function ViewProfileScreen() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { profileData: profileDataString } = useLocalSearchParams();
  const [appData, setAppData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [idType, setIdType] = useState('NIGERIAN_BVN_VERIFICATION');
  const [idNumber, setIdNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (profileDataString) {
      const parsedData = JSON.parse(profileDataString as string);
      // console.log("Parsed data: ", parsedData)
      setAppData(parsedData);
    }
  }, [profileDataString]);

  const handleKYCUpdate = async () => {
    if (!idNumber.trim()) {
      Alert.alert('Error', 'Please enter your ID number');
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would call your API to update KYC
      // const response = await api.user.updateKYC({ idType, idNumber });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Success',
        'Your KYC information has been submitted for verification. We will notify you once it\'s approved.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              setShowKYCModal(false);
              router.back(); // Go back to profile page which will have fresh data
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update KYC information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInfoSection = (title: string, items: { label: string; value: string | null | undefined }[], showUpdateButton = false) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {showUpdateButton && !appData?.kyc_verification?.is_verified && (
          <TouchableOpacity 
            style={styles.updateButton}
            onPress={() => setShowKYCModal(true)}
          >
            <MaterialCommunityIcons name="pencil" size={20} color={colors.primary.main} />
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.sectionContent}>
        {items.map((item, index) => (
          <View key={index} style={styles.infoItem}>
            <Text style={styles.infoLabel}>{item.label}</Text>
            <Text style={styles.infoValue}>{item.value || 'Not provided'}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://res.cloudinary.com/dwqurinck/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1744555156/bernard-image_hfk66b.jpg' }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>
            {appData?.user?.first_name} {appData?.user?.last_name}
          </Text>
          <Text style={styles.email}>{appData?.user?.email}</Text>
          <View style={styles.verificationBadge}>
            <MaterialCommunityIcons 
              name={appData?.user?.is_verified ? "check-circle" : "alert-circle"} 
              size={20} 
              color={appData?.user?.is_verified ? colors.success.main : colors.warning.main} 
            />
            <Text style={[
              styles.verificationText,
              { color: appData?.user?.is_verified ? colors.success.main : colors.warning.main }
            ]}>
              {appData?.user?.is_verified ? 'Verified Account' : 'Unverified Account'}
            </Text>
          </View>
        </View>

        {/* Personal Information */}
        {renderInfoSection('Personal Information', [
          { label: 'First Name', value: appData?.user?.first_name },
          { label: 'Last Name', value: appData?.user?.last_name },
          { label: 'Email', value: appData?.user?.email },
          { label: 'Phone Number', value: appData?.user?.phone_number },
        ])}

        {/* Account Information */}
        {renderInfoSection('Account Information', [
          { label: 'Account Type', value: 'Personal' },
          { label: 'Account Status', value: appData?.user?.is_verified ? 'Active' : 'Pending Verification' },
          { label: 'Member Since', value: appData?.user?.created_at },
        ])}

        {/* KYC Information */}
        {renderInfoSection('KYC Information', [
          { label: 'KYC Status', value: appData?.kyc_verification?.status },
          { label: 'Verification Level', value: appData?.kyc_verification?.level },
          { label: 'Last Updated', value: appData?.kyc_verification?.updated_at },
          ...(appData?.kyc_verification?.is_verified ? [
            { label: 'ID Type', value: appData?.kyc_verification?.id_type },
            { label: 'ID Number', value: appData?.kyc_verification?.id_number },
          ] : []),
        ], true)}

        {/* Security Information */}
        {renderInfoSection('Security', [
          { label: 'Two-Factor Authentication', value: 'Enabled' },
          { label: 'Last Login', value: appData?.user?.last_login },
          { label: 'Account Lock Status', value: 'Unlocked' },
        ])}

        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={colors.primary.main} />
          <Text style={styles.backButtonText}>Back to Profile</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* KYC Update Modal */}
      <Modal
        visible={showKYCModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowKYCModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update KYC Information</Text>
            <Text style={styles.modalDescription}>
              Please provide your BVN for verification. Other ID types will be available soon.
            </Text>

            <Select
              label="ID Type"
              value={idType}
              options={KYC_ID_TYPES}
              onChange={setIdType}
              disabled={true}
            />

            <Input
              label="BVN Number"
              value={idNumber}
              onChangeText={setIdNumber}
              placeholder="Enter your BVN"
              keyboardType="numeric"
              maxLength={11}
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setShowKYCModal(false)}
                style={styles.modalButton}
              />
              <Button
                title="Submit"
                onPress={handleKYCUpdate}
                style={styles.modalButton}
                loading={isSubmitting}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Loader visible={loading} message="Loading profile..." />
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
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  verificationText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 16,
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  updateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.light,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  updateButtonText: {
    marginLeft: 4,
    color: colors.primary.main,
    fontWeight: '500',
  },
  sectionContent: {
    gap: 16,
  },
  infoItem: {
    marginBottom: 12,
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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 24,
    marginBottom: 32,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.primary.main,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
}); 