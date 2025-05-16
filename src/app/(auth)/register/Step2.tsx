import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { useRegister } from '@/contexts/RegisterContexts';
import { Ionicons } from '@expo/vector-icons';

const countryCodes: Record<string, string> = {
  Nigeria: '+234',
  'United States': '+1',
  'United Kingdom': '+44',
  Canada: '+1',
  Ghana: '+233',
  'South Africa': '+27',
};

const fields = [
  { id: 'firstName', label: 'First Name', placeholder: 'Enter your first name', required: true, autoCapitalize: 'words' },
  { id: 'middleName', label: 'Middle Name (Optional)', placeholder: 'Enter your middle name', required: false, autoCapitalize: 'words' },
  { id: 'surname', label: 'Last Name', placeholder: 'Enter your last name', required: true, autoCapitalize: 'words' },
  { id: 'email', label: 'Email Address', placeholder: 'Enter your email', required: true, keyboardType: 'email-address', autoCapitalize: 'none' },
  { id: 'referral', label: 'Referral Code (Optional)', placeholder: 'Enter referral code if any', required: false },
];

type FormType = {
  firstName: string;
  middleName: string;
  surname: string;
  gender: string;
  email: string;
  phone: string;
  referral: string;
};

type ErrorType = Partial<Record<keyof FormType, string>>;

export default function Step2() {
  const { formData, updateForm } = useRegister();

  const [form, setForm] = useState<FormType>({
    firstName: formData.firstName || '',
    middleName: formData.middleName || '',
    surname: formData.surname || '',
    gender: formData.gender || '',
    email: formData.email || '',
    phone: formData.phone || '',
    referral: formData.referral || '',
  });

  const [errors, setErrors] = useState<ErrorType>({});
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    formData.country ? countryCodes[formData.country] || '+234' : '+234'
  );
  const [showCountryCodeModal, setShowCountryCodeModal] = useState(false);
  const [phoneWithoutCode, setPhoneWithoutCode] = useState('');

  useEffect(() => {
    if (formData.phone) {
      const match = formData.phone.match(/^\+\d+\s(.*)$/);
      setPhoneWithoutCode(match?.[1] ?? formData.phone);
    }
  }, []);

  useEffect(() => {
    if (phoneWithoutCode) {
      const fullPhone = `${selectedCountryCode} ${phoneWithoutCode}`;
      setForm((prev) => ({ ...prev, phone: fullPhone }));
    }
  }, [selectedCountryCode, phoneWithoutCode]);

  const validateField = (field: keyof FormType, value: string): string => {
    if (field === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value) ? '' : 'Please enter a valid email address';
    }

    if (field === 'phone' && value) {
      const phoneRegex = /^\+\d+\s\d{6,12}$/;
      return phoneRegex.test(value) ? '' : 'Please enter a valid phone number';
    }

    return '';
  };

  const handleChange = (field: keyof FormType, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handlePhoneChange = (value: string) => {
    setPhoneWithoutCode(value);
    const error = validateField('phone', `${selectedCountryCode} ${value}`);
    setErrors((prev) => ({ ...prev, phone: error }));
  };

  const handleContinue = () => {
    const newErrors: ErrorType = {};
    let hasError = false;

    for (const field of fields) {
      const value = form[field.id as keyof FormType];

      if (field.required && !value) {
        newErrors[field.id as keyof FormType] = `${field.label} is required`;
        hasError = true;
      }

      if (value) {
        const error = validateField(field.id as keyof FormType, value);
        if (error) {
          newErrors[field.id as keyof FormType] = error;
          hasError = true;
        }
      }
    }

    if (!form.gender) {
      newErrors.gender = 'Gender is required';
      hasError = true;
    }

    if (!form.phone || form.phone === `${selectedCountryCode} `) {
      newErrors.phone = 'Phone number is required';
      hasError = true;
    } else {
      const phoneError = validateField('phone', form.phone);
      if (phoneError) {
        newErrors.phone = phoneError;
        hasError = true;
      }
    }

    setErrors(newErrors);

    if (!hasError) {
      updateForm(form);
      router.push('/(auth)/register/Step3');
    }
  };

  const isFormInvalid = () => {
    const requiredFields = fields.filter((f) => f.required).map((f) => f.id as keyof FormType);
    const hasEmptyRequired = requiredFields.some((key) => !form[key]);
    const hasValidationErrors = Object.values(errors).some((e) => e);

    return hasEmptyRequired || hasValidationErrors || !form.gender || !form.phone;
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
      <ScrollView className="flex-1 bg-white px-5">
        <View className="flex-row justify-between my-6">
          {[1, 2, 3, 4].map((step) => (
            <View key={step} className={`h-1.5 flex-1 mx-1 rounded-full ${step <= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          ))}
        </View>

        <Text className="text-2xl font-bold mb-1 text-gray-800">Personal Details</Text>
        <Text className="text-sm text-gray-500 mb-6">Tell us a bit about yourself</Text>

        {fields.map((field) => (
          <View key={field.id} className="mb-4">
            <Text className="text-sm font-medium text-gray-400 mb-1.5">
              {field.label} {field.required && <Text className="text-red-500">*</Text>}
            </Text>
            <TextInput
              value={form[field.id as keyof FormType]}
              onChangeText={(text) => handleChange(field.id as keyof FormType, text)}
              placeholder={field.placeholder}
              autoCapitalize={field.autoCapitalize as any}
              keyboardType={field.keyboardType as any}
              className={`bg-gray-50 px-4 py-3 rounded-lg ${errors[field.id as keyof FormType] ? 'border border-red-400' : ''} text-gray-800`}
            />
            {errors[field.id as keyof FormType] && (
              <View className="flex-row items-center mt-1">
                <Ionicons name="alert-circle-outline" size={14} color="#f87171" />
                <Text className="text-red-500 text-xs ml-1">{errors[field.id as keyof FormType]}</Text>
              </View>
            )}
          </View>
        ))}

        {/* Gender */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-400 mb-1.5">
            Gender <Text className="text-red-500">*</Text>
          </Text>
          <TouchableOpacity
            onPress={() => setShowGenderModal(true)}
            style={[
              {
                backgroundColor: '#f9fafb',
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              },
              errors.gender && { borderColor: '#f87171', borderWidth: 1 },
            ]}
          >
            <Text className={form.gender ? 'text-gray-800' : 'text-gray-400'}>
              {form.gender || 'Select gender'}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#9ca3af" />
          </TouchableOpacity>
          {errors.gender && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="alert-circle-outline" size={14} color="#f87171" />
              <Text className="text-red-500 text-xs ml-1">{errors.gender}</Text>
            </View>
          )}
        </View>

        {/* Phone */}
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-400 mb-1.5">
            Phone Number <Text className="text-red-500">*</Text>
          </Text>
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => setShowCountryCodeModal(true)}
              style={{
                width: 80,
                backgroundColor: '#f9fafb',
                paddingHorizontal: 8,
                paddingVertical: 12,
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text className="text-gray-800">{selectedCountryCode}</Text>
              <Ionicons name="chevron-down" size={16} color="#9ca3af" />
            </TouchableOpacity>
            <TextInput
              value={phoneWithoutCode}
              onChangeText={handlePhoneChange}
              placeholder="Phone number"
              keyboardType="phone-pad"
              className={`bg-gray-50 px-4 py-3 rounded-r-lg flex-1 ${errors.phone ? 'border border-red-400' : ''}`}
            />
          </View>
          {errors.phone && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="alert-circle-outline" size={14} color="#f87171" />
              <Text className="text-red-500 text-xs ml-1">{errors.phone}</Text>
            </View>
          )}
        </View>

        {/* Continue button */}
        <TouchableOpacity
          onPress={handleContinue}
          style={{
            backgroundColor: '#2563eb',
            paddingVertical: 16,
            borderRadius: 12,
            marginTop: 16,
            marginBottom: 32,
            opacity: isFormInvalid() ? 0.5 : 1,
          }}
          disabled={isFormInvalid()}
        >
          <Text className="text-white text-center font-semibold text-base">Continue</Text>
        </TouchableOpacity>

        {/* Gender Modal */}
        <Modal visible={showGenderModal} transparent animationType="slide">
          <Pressable style={{ flex: 1, justifyContent: 'flex-end' }} onPress={() => setShowGenderModal(false)}>
            <Pressable style={{ backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
              <View className="p-5">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-xl font-semibold text-gray-800">Select Gender</Text>
                  <TouchableOpacity onPress={() => setShowGenderModal(false)}>
                    <Ionicons name="close" size={24} color="#4b5563" />
                  </TouchableOpacity>
                </View>
                {['Male', 'Female'].map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    onPress={() => {
                      setForm((prev) => ({ ...prev, gender }));
                      setShowGenderModal(false);
                    }}
                    style={{ paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Text className="text-gray-800 text-base">{gender}</Text>
                    {form.gender === gender && (
                      <Ionicons name="checkmark" size={20} color="#3b82f6" style={{ marginLeft: 'auto' }} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        {/* Country Code Modal */}
        <Modal visible={showCountryCodeModal} transparent animationType="slide">
          <Pressable style={{ flex: 1, justifyContent: 'flex-end' }} onPress={() => setShowCountryCodeModal(false)}>
            <Pressable style={{ backgroundColor: 'white', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
              <View className="p-5">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-xl font-semibold text-gray-800">Select Country Code</Text>
                  <TouchableOpacity onPress={() => setShowCountryCodeModal(false)}>
                    <Ionicons name="close" size={24} color="#4b5563" />
                  </TouchableOpacity>
                </View>
                {Object.entries(countryCodes).map(([country, code]) => (
                  <TouchableOpacity
                    key={country}
                    onPress={() => {
                      setSelectedCountryCode(code);
                      setShowCountryCodeModal(false);
                    }}
                    style={{
                      paddingVertical: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: '#f3f4f6',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text className="text-gray-800 text-base">{country}</Text>
                    <Text className="text-gray-600 font-medium">{code}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
