import { Stack } from 'expo-router';
import { colors } from '@/constants/theme';
import { RegisterProvider } from '@/contexts/RegisterContexts';

export default function AuthLayout() {
  return (
    <RegisterProvider>
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
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="login"
        options={{
          title: 'Login',
        }}
      />
      <Stack.Screen 
        name="register"
        options={{
          title: 'Register',
        }}
      />
      <Stack.Screen 
        name="forgot-password"
        options={{
          title: 'Forgot Password',
        }}
      />
      <Stack.Screen 
        name="pin-setup"
        options={{
          title: 'Set Up PIN',
        }}
      />
      <Stack.Screen 
        name="pin-verify"
        options={{
          title: 'Verify PIN',
        }}
      />
    </Stack>
    </RegisterProvider>
  );
} 