import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// API configuration
const API_URL = 'https://nestjs-payflex.onrender.com/api/v1';
// const API_URL = 'http://localhost:1000/api/v1';
const TOKEN_KEY = 'auth_token';

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
    
    // Configure fetch options
    const fetchOptions = {
      ...options,
      headers,
      // Add timeout
      signal: AbortSignal.timeout(30000), // 30 second timeout
    };
    
    console.log(`Making API request to: ${API_URL}${endpoint}`);
    
    // Make the request
    const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);
    
    // Handle token expiration (401 Unauthorized)
    if (response.status === 401) {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      throw new Error('Authentication expired. Please log in again.');
    }

    // Log response status and headers for debugging
    console.log(`API Response Status: ${response.status}`);
    console.log('API Response Headers:', response.headers);
    
    // If response is not ok, throw an error with the response text
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }
    
    return response;
  } catch (error) {
    console.error('API Request Failed:', error);
    
    // Handle specific error types
    if (error instanceof TypeError) {
      if (error.message === 'Network request failed') {
        throw new Error('Network request failed. Please check your internet connection and try again.');
      }
      if (error.message.includes('AbortError')) {
        throw new Error('Request timed out. Please try again.');
      }
    }
    
    throw error;
  }
}

// API methods
export const api = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) => 
      apiFetch('/auth/signin', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),
    
    register: (name: string, email: string, password: string) => 
      apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      }),
    
    logout: () => 
      apiFetch('/auth/logout', {
        method: 'POST',
      }),
    
    refreshToken: () => 
      apiFetch('/auth/refresh', {
        method: 'POST',
      }),
  },
  
  // User endpoints
  user: {
    getProfile: () => 
      apiFetch('/users/profile'),
    
    updateProfile: (data: any) => 
      apiFetch('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },
  
  // Add other API endpoints as needed
}; 