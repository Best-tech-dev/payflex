import { Stack } from 'expo-router';
import { useColorScheme, AppState, Platform } from 'react-native';
import { colors } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppPinProvider } from '@/contexts/AppPinContext';
import { useEffect } from 'react';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AppPinProvider>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.background.default,
            },
            headerTintColor: colors.text.primary,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            contentStyle: {
              backgroundColor: colors.background.paper,
            },
          }}
        >
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          <Stack.Screen name="vtu" options={{ headerShown: false }} />
          <Stack.Screen name="funding" options={{ headerShown: true, headerTitle: 'Funding', headerBackTitle: 'Back' }} />
          <Stack.Screen name="support" options={{ headerShown: false, headerTitle: 'Support', headerBackTitle: 'Back' }} />
          <Stack.Screen name="create-card-info" options={{ headerShown: false}} />
          <Stack.Screen 
            name="vas/tv" 
            options={{ 
              headerShown: true, 
              headerTitle: 'TV Subscription', 
              headerBackTitle: 'Back',
              headerRight: () => (
                <TouchableOpacity 
                  onPress={() => router.push('/vas/tv/history')}
                  style={{ marginRight: 16 }}
                >
                  <MaterialCommunityIcons name="history" size={24} color={colors.primary.main} />
                </TouchableOpacity>
              )
            }} 
          />
          <Stack.Screen name="vas/betting" options={{ headerShown: true, headerTitle: 'Betting', headerBackTitle: 'Back' }} />
          <Stack.Screen name="vas/electricity" options={{ headerShown: true, headerTitle: 'Electricity', headerBackTitle: 'Back' }} />
          <Stack.Screen name="vas/education" options={{ headerShown: true, headerTitle: 'Education', headerBackTitle: 'Back' }} />
          <Stack.Screen name="profile/index" options={{ headerShown: true, headerTitle: 'Profile', headerBackTitle: 'Back' }} />
          <Stack.Screen name="profile/settings" options={{ headerShown: true, headerTitle: 'Settings', headerBackTitle: 'Back' }} />
          <Stack.Screen name="profile/kyc" options={{ headerShown: true, headerTitle: 'KYC Verification', headerBackTitle: 'Back' }} />
          <Stack.Screen name="profile/edit" options={{ headerShown: true, headerTitle: 'Edit Profile', headerBackTitle: 'Back' }} />
          <Stack.Screen name="profile/change-password" options={{ headerShown: true, headerTitle: 'Change Password', headerBackTitle: 'Back' }} />
          
        </Stack>
      </AuthProvider>
    </AppPinProvider>
  );
} 