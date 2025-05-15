// File: src/app/(auth)/register/Step2.tsx
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useRegister } from '@/contexts/RegisterContexts';

// Country codes for phone numbers
const countryCodes = {
  'Nigeria': '+234',
  'United States': '+1',
  'United Kingdom': '+44',
  'Canada': '+1',
  'Ghana': '+233',
  'South Africa': '+27',
};

// Field configuration for easier management
const fields = [
  { id: 'firstName', label: 'First Name', placeholder: 'Enter your first name', required: true, autoCapitalize: 'words' },
  { id: 'middleName', label: 'Middle Name (Optional)', placeholder: 'Enter your middle name', required: false, autoCapitalize: 'words' },
  { id: 'surname', label: 'Last Name', placeholder: 'Enter your last name', required: true, autoCapitalize: 'words' },
  // Gender is handled separately now
  { id: 'email', label: 'Email Address', placeholder: 'Enter your email', required: true, keyboardType: 'email-address', autoCapitalize: 'none' },
  // Phone is handled separately now
  { id: 'referral', label: 'Referral Code (Optional)', placeholder: 'Enter referral code if any', required: false },
];

export default function Step2() {
  const { formData, updateForm } = useRegister();
  const [form, setForm] = useState({
    firstName: formData.firstName || '',
    middleName: formData.middleName || '',
    surname: formData.surname || '',
    gender: formData.gender || '',
    email: formData.email || '',
    phone: formData.phone || '',
    referral: formData.referral || '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    formData.country ? countryCodes[formData.country as keyof typeof countryCodes] || '+234' : '+234'
  );
  const [showCountryCodeModal, setShowCountryCodeModal] = useState(false);
  const [phoneWithoutCode, setPhoneWithoutCode] = useState('');

  // Set phone without code on initial load
  useEffect(() => {
    if (formData.phone) {
      // Extract phone number without country code
      const phoneRegex = /^\+\d+\s(.*)$/;
      const match = formData.phone.match(phoneRegex);
      if (match && match[1]) {
        setPhoneWithoutCode(match[1]);
      } else {
        setPhoneWithoutCode(formData.phone);
      }
    }
  }, []);

  // Update full phone when country code or phone number changes
  useEffect(() => {
    if (phoneWithoutCode) {
      const fullPhone = `${selectedCountryCode} ${phoneWithoutCode}`;
      setForm(prev => ({ ...prev, phone: fullPhone }));
    }
  }, [selectedCountryCode, phoneWithoutCode]);

  // Validate form fields
  const validateField = (field: string, value: string) => {
    if (field === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }
    
    if (field === 'phone' && value) {
      // Validate only the digits part
      const phoneRegex = /^\+\d+\s[0-9]{6,12}$/;
      if (!phoneRegex.test(value)) {
        return 'Please enter a valid phone number';
      }
    }
    
    return '';
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    
    // Validate on change
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handlePhoneChange = (value: string) => {
    setPhoneWithoutCode(value);
    
    // Validate full phone number
    const fullPhone = `${selectedCountryCode} ${value}`;
    const error = validateField('phone', fullPhone);
    setErrors(prev => ({ ...prev, phone: error }));
  };

  const handleGenderSelect = (gender: string) => {
    setForm(prev => ({ ...prev, gender }));
    setShowGenderModal(false);
  };

  const handleCountryCodeSelect = (code: string) => {
    setSelectedCountryCode(code);
    setShowCountryCodeModal(false);
  };

  const handleContinue = () => {
    // Check required fields
    const newErrors: Record<string, string> = {};
    let hasError = false;
    
    fields.forEach(field => {
      if (field.required && !form[field.id as keyof typeof form]) {
        newErrors[field.id] = `${field.label} is required`;
        hasError = true;
      } else {
        const error = validateField(field.id, form[field.id as keyof typeof form]);
        if (error) {
          newErrors[field.id] = error;
          hasError = true;
        }
      }
    });
    
    // Check gender separately
    if (!form.gender) {
      newErrors.gender = 'Gender is required';
      hasError = true;
    }
    
    // Check phone separately
    if (!form.phone || form.phone === `${selectedCountryCode} `) {
      newErrors.phone = 'Phone number is required';
      hasError = true;
    } else {
      const error = validateField('phone', form.phone);
      if (error) {
        newErrors.phone = error;
        hasError = true;
      }
    }
    
    setErrors(newErrors);
    
    if (!hasError) {
      updateForm(form);
      router.push('/(auth)/register/Step3');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView className="flex-1 bg-white p-5">
        {/* Progress indicator */}
        <View className="flex-row justify-between mb-6 mt-2">
          {[1, 2, 3, 4].map((step) => (
            <View 
              key={step} 
              className={`h-2 flex-1 mx-1 rounded-full ${step <= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}
            />
          ))}
        </View>
        
        <Text className="text-xl font-bold mb-2">Personal Details</Text>
        <Text className="text-sm text-gray-500 mb-4">Tell us a bit about yourself</Text>
        
        {/* Regular text inputs */}
        {fields.map((field) => (
          <View key={field.id} className="mb-3">
            <Text className="text-xs font-medium text-gray-700 mb-1">
              {field.label} {field.required && <Text className="text-red-500">*</Text>}
            </Text>
            <TextInput
              value={form[field.id as keyof typeof form]}
              onChangeText={(text) => handleChange(field.id, text)}
              placeholder={field.placeholder}
              autoCapitalize={field.autoCapitalize as any || 'none'}
              keyboardType={field.keyboardType as any || 'default'}
              className={`bg-white px-3 py-2 rounded-lg border ${errors[field.id] ? 'border-red-500' : 'border-gray-300'} text-sm`}
            />
            {errors[field.id] ? (
              <Text className="text-red-500 text-xs mt-1">{errors[field.id]}</Text>
            ) : null}
          </View>
        ))}
        
        {/* Gender selection */}
        <View className="mb-3">
          <Text className="text-xs font-medium text-gray-700 mb-1">
            Gender <Text className="text-red-500">*</Text>
          </Text>
          <TouchableOpacity 
            onPress={() => setShowGenderModal(true)}
            style={{
              backgroundColor: 'white',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: errors.gender ? '#ef4444' : '#d1d5db',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Text className={`text-sm ${form.gender ? 'text-black' : 'text-gray-400'}`}>
              {form.gender || 'Select gender'}
            </Text>
            <Text>▼</Text>
          </TouchableOpacity>
          {errors.gender ? (
            <Text className="text-red-500 text-xs mt-1">{errors.gender}</Text>
          ) : null}
        </View>
        
        {/* Phone number with country code */}
        <View className="mb-3">
          <Text className="text-xs font-medium text-gray-700 mb-1">
            Phone Number <Text className="text-red-500">*</Text>
          </Text>
          <View className="flex-row">
            <TouchableOpacity 
              onPress={() => setShowCountryCodeModal(true)}
              style={{ 
                ...{
                  backgroundColor: 'white',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderTopLeftRadius: 8,
                  borderBottomLeftRadius: 8,
                  borderWidth: 1,
                  borderColor: '#d1d5db',
                  flexDirection: 'row',
                  alignItems: 'center'
                },
                width: 80 
              }}
              
            >
              <Text className="text-sm">{selectedCountryCode}</Text>
              <Text className="ml-1">▼</Text>
            </TouchableOpacity>
            <TextInput
              value={phoneWithoutCode}
              onChangeText={handlePhoneChange}
              placeholder="Phone number"
              keyboardType="phone-pad"
              className={`bg-white px-3 py-2 rounded-r-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} text-sm flex-1`}
            />
          </View>
          {errors.phone ? (
            <Text className="text-red-500 text-xs mt-1">{errors.phone}</Text>
          ) : null}
        </View>
        
        <TouchableOpacity
          onPress={handleContinue}
          style={{
            padding: 14,
            borderRadius: 9999,
            backgroundColor: '#2563eb',
            marginTop: 12,
            marginBottom: 24
          }}
        >
          <Text className="text-white text-center font-semibold text-sm">Continue</Text>
        </TouchableOpacity>
        
        {/* Gender Selection Modal */}
        <Modal
          visible={showGenderModal}
          transparent={true}
          animationType="slide"
        >
          <View className="flex-1 justify-end bg-black bg-opacity-50">
            <View className="bg-white rounded-t-xl p-4">
              <Text className="text-lg font-bold mb-4 text-center">Select Gender</Text>
              
              <TouchableOpacity 
                onPress={() => handleGenderSelect('Male')}
                style={{
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#e5e7eb'
                }}
              >
                <Text className="text-center text-base">Male</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => handleGenderSelect('Female')}
                style={{padding: 12}}
              >
                <Text className="text-center text-base">Female</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => setShowGenderModal(false)}
                style={{
                  marginTop: 16,
                  backgroundColor: '#e5e7eb',
                  paddingVertical: 12,
                  borderRadius: 9999
                }}
              >
                <Text className="text-center font-medium">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        {/* Country Code Selection Modal */}
        <Modal
          visible={showCountryCodeModal}
          transparent={true}
          animationType="slide"
        >
          <View className="flex-1 justify-end bg-black bg-opacity-50">
            <View className="bg-white rounded-t-xl p-4">
              <Text className="text-lg font-bold mb-4 text-center">Select Country Code</Text>
              
              {Object.entries(countryCodes).map(([country, code]) => (
                <TouchableOpacity 
                  key={country}
                  onPress={() => handleCountryCodeSelect(code)}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#e5e7eb',
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                  }}
                >
                  <Text className="text-base">{country}</Text>
                  <Text className="text-base font-medium">{code}</Text>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity 
                onPress={() => setShowCountryCodeModal(false)}
                style={{
                  marginTop: 16,
                  backgroundColor: '#e5e7eb',
                  paddingVertical: 12,
                  borderRadius: 9999
                }}
              >
                <Text className="text-center font-medium">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}