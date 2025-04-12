import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { logout } from './auth';

// API configuration
// const API_URL = 'https://nestjs-payflex.onrender.com/api/v1';
const API_URL = 'http://localhost:1000/api/v1';

const TOKEN_KEY = 'access_token';

// Create a custom fetch function with authentication
export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  try {
    // Get the token from secure storage
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    
    // Prepare headers with platform-specific settings
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Platform': Platform.OS,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };
    
    // Create a custom timeout solution
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    // Configure fetch options
    const fetchOptions = {
      ...options,
      headers,
      signal: controller.signal,
    };
    
    // console.log(`Making API request to: ${API_URL}${endpoint}`);
    
    try {
      // Make the request
      const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);
      
      // Clear the timeout since the request completed
      clearTimeout(timeoutId);
      
      // Handle token expiration (401 Unauthorized)
      if (response.status === 401) {
        console.log("Toekn expired, logging out..."); 
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await logout();
        // router.replace('/(auth)/login');
        throw new Error('Authentication expired. Please log in again.');
      }
      
      // If response is not ok, throw an error with the response text
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }
      
      return response;
    } finally {
      // Make sure to clear the timeout in case of any error
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error('API Request Failed:', error);
    
    // Handle specific error types
    if (error instanceof TypeError) {
      if (error.message === 'Network request failed') {
        throw new Error('Network request failed. Please check your internet connection and try again.');
      }
    }
    
    // Handle abort error (timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    
    throw error;
  }
}

// API methods
export const api = {
  auth: {
    login: (email: string, password: string) =>
      apiFetch('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    register: (email: string, password: string, firstName: string, lastName: string) =>
      apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      }),

    logout: () =>
      apiFetch('/auth/logout', {
        method: 'POST',
      }),

    refreshToken: () =>
      apiFetch('/auth/refresh', {
        method: 'POST',
      }),

      // 🔥 New forgot-password-related APIs
    sendOtpToEmail: (email: string) =>
      apiFetch('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),

    verifyOtp: (email: string, otp: string) =>
      apiFetch('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      }),
  },
  
  // User endpoints
  user: {
    getProfile: () => 
      apiFetch('/user/fetch-user-profile'),
    
    // updateProfile: (data: any) => 
    //   apiFetch('/users/profile', {
    //     method: 'PATCH',
    //     body: JSON.stringify(data),
    //   }),
  },

  wallet: {
    fetchWallet: async () => {
      const response = await apiFetch('/user/wallet');
      const data = await response.json();

      if(!data.success) {
        console.log("Error fetching wallet data:", data.message);
        throw new Error(data.message || 'Failed to fetch wallet data');
      }

      return data.data;
    },

    fetchTransactions: async () => {
      const response = await apiFetch('/history/fetch-all-history?limit=2');
      const data = await response.json();

      // console.log("Res: ", response);
      // console.log("retrieved transactions: ", data.data.transactions);

      if(!data.success) {
        console.log("Error fetching transactions data:", data.message);
        throw new Error(data.message || 'Failed to fetch transactions data');
      }
      return data.data;
    }
  }
  
  // Add other API endpoints as needed
};