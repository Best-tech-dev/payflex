import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/common/Select';
import { Loader } from '@/components/Loader';
import { SuccessModal } from '@/components/SuccessModal';
import { colors } from '@/constants/theme';

// Mock user data
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+234 801 234 5678',
  profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg',
  accountType: 'Personal',
  gender: 'male',
  dateOfBirth: '1990-01-01',
  address: '123 Main St, Lagos, Nigeria',
};

// Account type options
const accountTypes = [
  { label: 'Personal', value: 'personal' },
  { label: 'Business', value: 'business' },
  { label: 'Savings', value: 'savings' },
];

// Gender options
const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
];

export default function EditProfileScreen() {
  const [user, setUser] = useState(mockUser);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setUser({ ...user, [field]: value });
    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!user.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!user.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!user.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      
      // Hide success message after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        router.back();
      }, 2000);
    }, 1500);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: user.profilePicture }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.changeImageButton}>
            <Text style={styles.changeImageText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <Input
            label="Full Name"
            value={user.name}
            onChangeText={(text) => handleChange('name', text)}
            error={errors.name}
            placeholder="Enter your full name"
          />
          
          <Input
            label="Email"
            value={user.email}
            onChangeText={(text) => handleChange('email', text)}
            error={errors.email}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Input
            label="Phone Number"
            value={user.phone}
            onChangeText={(text) => handleChange('phone', text)}
            error={errors.phone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
          
          <Select
            label="Account Type"
            value={user.accountType.toLowerCase()}
            options={accountTypes}
            onChange={(value) => handleChange('accountType', value)}
            placeholder="Select account type"
          />
          
          <Select
            label="Gender"
            value={user.gender}
            options={genderOptions}
            onChange={(value) => handleChange('gender', value)}
            placeholder="Select gender"
          />
          
          <Input
            label="Date of Birth"
            value={user.dateOfBirth}
            onChangeText={(text) => handleChange('dateOfBirth', text)}
            placeholder="YYYY-MM-DD"
          />
          
          <Input
            label="Address"
            value={user.address}
            onChangeText={(text) => handleChange('address', text)}
            placeholder="Enter your address"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={handleCancel}
            style={styles.cancelButton}
          />
          <Button
            title="Save Changes"
            onPress={handleSave}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>

      {/* Loading Modal */}
      <Loader visible={isLoading} message="Saving your profile..." />

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccess}
        title="Success"
        message="Your profile has been updated successfully!"
        onClose={() => setShowSuccess(false)}
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
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  changeImageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.primary.light,
  },
  changeImageText: {
    color: colors.primary.main,
    fontWeight: '500',
  },
  formContainer: {
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 12,
  },
  saveButton: {
    flex: 1,
    marginLeft: 12,
  },
}); 