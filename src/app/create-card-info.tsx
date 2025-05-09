import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import BigLoader from '@/components/BigLoader';
import { router } from 'expo-router';

export default function CardInfoPage() {
  const [agreed, setAgreed] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const navigation = useNavigation();

  const handleCheckboxChange = () => {
    setAgreed(!agreed);
  };

  const handleCreateCard = () => {
    setIsCreating(true);
    setTimeout(() => {
      
        router.back()
        Alert.alert("Success", "You've successfully created a new Virtual card")
    }, 2000);
  };

  if (isCreating) {
    return <BigLoader message="Your virtual card is being created..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="p-4 border-b border-gray-300">
          <TouchableOpacity style={{ padding: 8 }} onPress={() => navigation.goBack()}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path d="M19 12H5" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              <Path d="M12 19L5 12L12 5" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 p-6">
          <Text className="text-2xl font-bold mb-2">How our cards work</Text>
          <Text className="text-gray-600 mb-8">
            Please read the following to understand how our cards work
          </Text>

          {/* Card Creation Fee */}
          <View className="flex-row mb-6">
            <View className="w-12 h-12 rounded-full bg-blue-100 justify-center items-center mr-4">
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="#3b82f6">
                <Rect x={3} y={6} width={18} height={12} rx={2} stroke="#3b82f6" strokeWidth={2} />
                <Path d="M7 12H17" stroke="#3b82f6" strokeWidth={2} strokeLinecap="round" />
              </Svg>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold mb-1">Card creation fee</Text>
              <Text className="text-gray-600 mb-1">
                You will be charged a one-time $4 card creation and $1 funding fee, making it a total of $5.
              </Text>
              <TouchableOpacity>
                <Text className="text-blue-500 font-medium">Learn more</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Cross-border Charges */}
          <View className="flex-row mb-6">
            <View className="w-12 h-12 rounded-full bg-purple-100 justify-center items-center mr-4">
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="#8b5cf6">
                <Path d="M12 3v18M3 12h18" stroke="#8b5cf6" strokeWidth={2} strokeLinecap="round" />
                <Path
                  d="M16 8l-4 4-4-4M8 16l4-4 4 4"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold mb-1">Cross-border charges</Text>
              <Text className="text-gray-600 mb-1">
                You will incur a cross-border fee when using your card for non-USD payments, and on non-US platforms.
              </Text>
              <TouchableOpacity>
                <Text className="text-blue-500 font-medium">Learn more</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Card Termination */}
          <View className="flex-row mb-6">
            <View className="w-12 h-12 rounded-full bg-red-100 justify-center items-center mr-4">
              <Svg width={24} height={24} viewBox="0 0 24 24" fill="#ef4444">
                <Path
                  d="M12 8v4M12 16h.01"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Circle cx={12} cy={12} r={9} stroke="#ef4444" strokeWidth={2} />
              </Svg>
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold mb-1">Card termination</Text>
              <Text className="text-gray-600 mb-1">
                Your card may be terminated if you have several failed transactions due to insufficient funds.
              </Text>
              <TouchableOpacity>
                <Text className="text-blue-500 font-medium">Learn more</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="p-6 border-t border-gray-300">
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
            onPress={handleCheckboxChange}
          >
            <View
              className={`w-6 h-6 border rounded mr-3 justify-center items-center ${
                agreed ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
              }`}
            >
              {agreed && (
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M20 6L9 17L4 12"
                    stroke="white"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              )}
            </View>
            <Text className="text-gray-800">I understand, and agree to proceed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              width: '100%',
              padding: 16,
              borderRadius: 8,
              backgroundColor: agreed ? '#3b82f6' : '#e5e7eb',
              alignItems: 'center',
            }}
            disabled={!agreed}
            onPress={handleCreateCard}
          >
            <Text className='text-white font-semibold'>Create virtual card</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}