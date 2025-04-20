import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styled } from 'nativewind';
import { api } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/contexts/AuthContext';
import ENV from '@/config/env';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);
const StyledScrollView = styled(ScrollView);

const ProfileScreen = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
      return;
    }

    setLoading(true);
    try {
        // Fetch fresh data
        const data = await api.user.getprofilePageData();
        setProfileData(data);
    } catch (error) {
      console.error('Error fetching app details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add useEffect to log profileData changes
  useEffect(() => {
    if (profileData) {
      console.log("(profile.tsx) profileData updated fetched successfully");
    }
  }, [profileData]);

  const menuItems = [
    {
      title: 'Personal Information',
      icon: 'person-outline' as const,
      onPress: () => router.push({
        pathname: '/profile/edit',
        params: { profileData: JSON.stringify(profileData) }
      }),
      description: 'View your personal information'
    },
    {
      title: 'KYC Verification',
      icon: 'shield-checkmark-outline' as const,
      onPress: profileData?.kyc_verification?.status === 'approved' 
        ? undefined 
        : () => router.push('/profile/kyc'),
      description: profileData?.kyc_verification?.status === 'approved' 
        ? 'KYC Verified' 
        : 'Complete your KYC verification',
      disabled: profileData?.kyc_verification?.status === 'approved'
    },
    {
      title: 'Security Settings',
      icon: 'lock-closed-outline' as const,
      onPress: () => router.push('/profile/settings'),
      description: 'Manage your security preferences'
    },
    {
      title: 'Support',
      icon: 'help-circle-outline' as const,
      onPress: () => router.push('/support'),
      description: 'Get help and support'
    }
  ];

  const handleLogout = async () => {
    try {
      await api.auth.logout();
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const defaultDisplayPicture = ENV.DEFAULT_DISPLAY_PICTURE;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StyledScrollView className="flex-1">
        {/* Profile Header */}
        <StyledView className="items-center py-6 px-4 bg-primary/5 mt-20">
          <StyledView className="relative">
          <Image
            source={{ uri: profileData?.user?.display_picture || defaultDisplayPicture }}
            style={{ width: 45, height: 45, borderRadius: 999, marginRight: 8 }}
            resizeMode="cover"
          />
          </StyledView>
          <StyledText className="text-2xl font-bold mt-4">
            {profileData?.user?.first_name} {profileData?.user?.last_name}
          </StyledText>
          <StyledText className="text-gray-500">{profileData?.user?.email}</StyledText>
          <StyledView className="flex-row items-center mt-2">
            {profileData?.user?.is_verified ? (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <StyledText className="text-green-600 ml-1">Verified Account</StyledText>
              </>
            ) : (
              <>
                <Ionicons name="alert-circle" size={20} color="#FF9800" />
                <StyledText className="text-orange-500 ml-1">Unverified Account</StyledText>
              </>
            )}
          </StyledView>
        </StyledView>

        {/* Quick Stats */}
        <StyledView className="flex-row justify-around py-4 bg-white border-b border-gray-100">
          <StyledView className="items-center">
            <StyledText className="text-2xl font-bold">
              ₦{profileData?.wallet_card?.current_balance || '0'}
            </StyledText>
            <StyledText className="text-gray-500">Naira Value</StyledText>
          </StyledView>
          <StyledView className="items-center">
            <StyledText className="text-2xl font-bold">
              {profileData?.cards?.length || 0}
            </StyledText>
            <StyledText className="text-gray-500">Cards</StyledText>
          </StyledView>
          <StyledView className="items-center">
            <StyledText className="text-2xl font-bold">
              {profileData?.accounts?.length || 0}
            </StyledText>
            <StyledText className="text-gray-500">Accounts</StyledText>
          </StyledView>
        </StyledView>

        {/* Menu Items */}
        <StyledView className="px-4 py-6">
          {menuItems.map((item, index) => (
            <StyledTouchableOpacity
              key={index}
              className={`flex-row items-center p-4 bg-white rounded-lg mb-3 shadow-sm ${item.disabled ? 'opacity-50' : ''}`}
              onPress={item.onPress}
              disabled={item.disabled}
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
          onPress={handleLogout}
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