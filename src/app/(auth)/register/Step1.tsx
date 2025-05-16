

// File: src/app/(auth)/register/Step1.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRegister } from '@/contexts/RegisterContexts';
import { router } from 'expo-router';

// Common countries with flags (reordered as requested)
const countries = [
  { name: 'Nigeria', code: 'NG', flag: '🇳🇬' },
  { name: 'United States', code: 'US', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦' },
  { name: 'Ghana', code: 'GH', flag: '🇬🇭' },
  { name: 'South Africa', code: 'ZA', flag: '🇿🇦' },
];

export default function Step1() {
  const { formData, updateForm } = useRegister();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(formData.country || null);

  const handleNext = () => {
    if (!selectedCountry) return;
    updateForm({ country: selectedCountry });
    router.push('/(auth)/register/Step2');
  };

  return (
    <View className="flex-1 bg-white p-5">
      
      {/* Progress indicator */}
      <View className="flex-row justify-between mb-4 mt-2">
            {[1, 2, 3, 4].map((step) => (
              <View key={step} className="flex-1 mx-1">
                <View 
                  className={`h-1.5 rounded-full ${step <= 1 ? 'bg-blue-600' : 'bg-gray-200'}`}
                />
                <Text className={`text-xs mt-1 text-center ${step <= 1 ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                  Step {step}
                </Text>
              </View>
            ))}
          </View>
      
      <Text className="text-2xl font-bold mb-2">Welcome!</Text>
      <Text className="text-base text-gray-500 mb-6">Let's start by selecting your country of residence</Text>
      
      <ScrollView className="mb-4">
        {countries.map((country) => (
          <TouchableOpacity
            key={country.code}
            style={[
              { 
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                marginBottom: 12,
                borderRadius: 8,
                borderWidth: 1
              },
              selectedCountry === country.name 
                ? { borderColor: '#2563eb', backgroundColor: '#eff6ff' }
                : { borderColor: '#d1d5db' }
            ]}
            onPress={() => setSelectedCountry(country.name)}
          >
            <Text className="text-2xl mr-3">{country.flag}</Text>
            <Text className="text-base">{country.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[
          {
            padding: 16,
            borderRadius: 999
          },
          selectedCountry 
            ? { backgroundColor: '#2563eb' }
            : { backgroundColor: '#d1d5db' }
        ]}
        disabled={!selectedCountry}
        onPress={handleNext}
      >
        <Text className="text-white text-center font-semibold">Continue</Text>
      </TouchableOpacity>
    </View>
  );
}