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
  options: RequestInit = {},
  requiresAuth: boolean = true
): Promise<Response> {
  try {
    // Prepare headers with platform-specific settings
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Platform': Platform.OS
    });

    // Add any custom headers from options
    if (options.headers) {
      const customHeaders = new Headers(options.headers);
      customHeaders.forEach((value: string, key: string) => {
        headers.set(key, value);
      });
    }

    // Only add authorization header if endpoint requires auth
    if (requiresAuth) {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }
    
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
      if (requiresAuth && response.status === 401) {
        console.log("Token expired, logging out..."); 
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await logout();
        router.replace('/(auth)/login');
        throw new Error('Authentication expired. Please log in again.');
      }
      
      // If response is not ok, throw an error with the response text
      if (!response.ok) {
        let errorMessage = `API request failed with status ${response.status}`;
      
        try {
          const errorData = await response.json();
          console.error('API Error Response:', errorData);
      
          // Customize what gets shown
          if (errorData?.message) {
            errorMessage = errorData.message;
          }
        } catch (jsonError) {
          // Fall back if it's not JSON
          const text = await response.text();
          errorMessage = text;
        }
      
        throw new Error(errorMessage);
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
      }, false),

    register: (email: string, password: string, firstName: string, lastName: string) =>
      apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        }),
      }, false),

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
      apiFetch('/auth/request-password-reset-email', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }, false),

    updatePassword: (email: string, otp: string, newPassword: string) =>
      apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, otp, new_password: newPassword }),
      }, false),
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

    fundWallet: async (amount: number) => {
      const response = await apiFetch('/banking/initialise-paystack-funding', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();
      // console.log("Res: ", response);
      // console.log("retrieved transactions: ", data.data.transactions);
      if(!data.success) {
        console.log("Error funding wallet:", data.message);
        throw new Error(data.message || 'Failed to fund wallet'); 
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