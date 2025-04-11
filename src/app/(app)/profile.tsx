import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);

const ProfileScreen = () => {
  const router = useRouter();

  const menuItems = [
    {
      title: 'Settings',
      icon: 'settings-outline' as const,
      onPress: () => router.push('/profile/settings'),
      description: 'Manage your app preferences and account settings'
    },
    {
      title: 'KYC Verification',
      icon: 'shield-checkmark-outline' as const,
      onPress: () => router.push('/profile/kyc'),
      description: 'Complete or update your KYC verification'
    },
    {
      title: 'Edit Profile',
      icon: 'person-outline' as const,
      onPress: () => router.push('/profile/edit'),
      description: 'Update your personal information'
    },
    {
      title: 'Change Password',
      icon: 'lock-closed-outline' as const,
      onPress: () => router.push('/profile/change-password'),
      description: 'Update your account password'
    },
    {
      title: 'Security Settings',
      icon: 'shield-outline' as const,
      onPress: () => router.push('/profile/security'),
      description: 'Manage your security preferences'
    },
    {
      title: 'Notifications',
      icon: 'notifications-outline' as const,
      onPress: () => router.push('/profile/notifications'),
      description: 'Configure your notification preferences'
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StyledScrollView className="flex-1">
        {/* Profile Header */}
        <StyledView className="items-center py-6 px-4">
          <StyledView className="relative">
            <StyledImage
              source={{ uri: 'https://via.placeholder.com/100' }}
              className="w-24 h-24 rounded-full"
            />
            <StyledTouchableOpacity 
              className="absolute bottom-0 right-0 bg-primary p-2 rounded-full"
              onPress={() => router.push('/profile/edit')}
            >
              <Ionicons name="camera" size={20} color="white" />
            </StyledTouchableOpacity>
          </StyledView>
          <StyledText className="text-2xl font-bold mt-4">John Doe</StyledText>
          <StyledText className="text-gray-500">john.doe@example.com</StyledText>
          <StyledView className="flex-row items-center mt-2">
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
            <StyledText className="text-green-600 ml-1">Verified Account</StyledText>
          </StyledView>
        </StyledView>

        {/* Quick Stats */}
        <StyledView className="flex-row justify-around py-4 bg-gray-50">
          <StyledView className="items-center">
            <StyledText className="text-2xl font-bold">$1,234.56</StyledText>
            <StyledText className="text-gray-500">Balance</StyledText>
          </StyledView>
          <StyledView className="items-center">
            <StyledText className="text-2xl font-bold">12</StyledText>
            <StyledText className="text-gray-500">Cards</StyledText>
          </StyledView>
          <StyledView className="items-center">
            <StyledText className="text-2xl font-bold">5</StyledText>
            <StyledText className="text-gray-500">Accounts</StyledText>
          </StyledView>
        </StyledView>

        {/* Menu Items */}
        <StyledView className="px-4 py-6">
          {menuItems.map((item, index) => (
            <StyledTouchableOpacity
              key={index}
              className="flex-row items-center p-4 bg-white rounded-lg mb-3 shadow-sm"
              onPress={item.onPress}
            >
              <StyledView className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
                <Ionicons name={item.icon} size={24} color="#007AFF" />
              </StyledView>
              <StyledView className="flex-1 ml-4">
                <StyledText className="text-lg font-semibold">{item.title}</StyledText>
                <StyledText className="text-gray-500 text-sm">{item.description}</StyledText>
              </StyledView>
              <Ionicons name="chevron-forward" size={24} color="#C7C7CC" />
            </StyledTouchableOpacity>
          ))}
        </StyledView>

        {/* Logout Button */}
        <StyledTouchableOpacity 
          className="mx-4 mb-8 p-4 bg-red-50 rounded-lg"
          onPress={() => {
            // Handle logout
          }}
        >
          <StyledView className="flex-row items-center justify-center">
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            <StyledText className="text-red-500 font-semibold ml-2">Log Out</StyledText>
          </StyledView>
        </StyledTouchableOpacity>
      </StyledScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen; 