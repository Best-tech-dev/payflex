import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { logout } from './auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API configuration
// const API_URL = 'https://nestjs-payflex.onrender.com/api/v1';
const API_URL = 'http://localhost:1000/api/v1';

const TOKEN_KEY = 'access_token';

// Add this interface at the top of the file or in a separate types file
interface RegistrationData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phone?: string;
  gender?: string;
  country?: string;
  referralCode?: string;
  updatesOptIn?: boolean;
  agreeToterms: boolean;
}

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
    
    console.log(`Making API request to: ${API_URL}${endpoint}`);
    
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

    register: (data: RegistrationData) =>
      apiFetch('/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          firstName: data.firstName,
          lastName: data.lastName,
          middleName: data.middleName,
          phone: data.phone,
          gender: data.gender,
          country: data.country,
          referral_code: data.referralCode,
          updates_opt_in: data.updatesOptIn,
          agreeToTerms: data.agreeToterms,
        }),
      }, false),

    verifyOTP: (otp: string, email: string) =>
      apiFetch('/auth/verify-email-otp', {
        method: 'POST',
        body: JSON.stringify({ otp, email }),
      }, false),

    logout: () =>
      apiFetch('/auth/logout', {
        method: 'POST',
      }),

    refreshToken: () =>
      apiFetch('/auth/refresh', {
        method: 'POST',
      }),
      
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

    getAppHomepageDetails: async () => {
      const response = await apiFetch('/user/fetch-app-homepage-details');
      const data = await response.json();
      
      
      return data.data;
    },

    // profile page data 
    getprofilePageData: async () => {
      const response = await apiFetch('/user/app-user-profile-page');
      // console.log("response from api.tsx: ", response)
      const data = await response.json();

      if(!data.success) {
        console.log("Error fetching app details:", data.message);
        throw new Error(data.message || 'Failed to fetch app details');
      }

      console.log("User profile page data fetched successfully")
      return data.data;
    },
    
    getAppDetails: async () => {
      const response = await apiFetch('/user/fetch-user-app-details');
      const data = await response.json();

      if(!data.success) {
        console.log("Error fetching app details:", data.message);
        throw new Error(data.message || 'Failed to fetch app details');
      }

      console.log("User data successfully fetched: ");

      return data.data;
    },
    
    // updateProfile: (data: any) => 
    //   apiFetch('/users/profile', {
    //     method: 'PATCH',
    //     body: JSON.stringify(data),
    //   }),

    updateKYC: async (id_type: string, id_number: string) => {
      console.log("Data to update kyc: ", id_type, id_number);
      const response = await apiFetch('/user/update-kyc', {
        method: 'PUT',
        body: JSON.stringify({ id_type, id_number }),
      });
      const res = await response.json();

      if(!res.success) {
        console.log("Error updating kyc:", res.message);
        throw new Error(res.message || 'Failed to update kyc');
      }

      return res.data;
    }
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

    fundWallet: async (amount: number, callback_url: string) => {
      const response = await apiFetch('/banking/initialise-paystack-funding', {
        method: 'POST',
        body: JSON.stringify({ 
          amount, 
          callback_url 
        }),
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

    verifyPaystackPayment: async (reference: string) => {
      const response = await apiFetch('/banking/verify-paystack-funding', {
        method: 'POST',
        body: JSON.stringify({ reference }),
      });
      const data = await response.json();
      if(!data.success) {
        console.log("Error verifying payment:", data.message);
        throw new Error(data.message || 'Failed to verify payment'); 
      }
      return data.data;
    },

    verifyPayment: async () => {
      const response = await apiFetch('/banking/verify-payment', {
        method: 'GET',
      });
      const data = await response.json();
      if(!data.success) {
        console.log("Error verifying payment:", data.message);
        throw new Error(data.message || 'Failed to verify payment');
      }
      return data;
    },

    generateOneTimeAccount: async (amount: number) => {
      const response = await apiFetch('/banking/flw/create-one-time-virtual-account', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      });
      const data = await response.json();
      if(!data.success) {
        console.log("Error generating one-time account:", data.message);
        throw new Error(data.message || 'Failed to generate one-time account');
      }
      return data.data;
    },

    fetchTransactions: async (limit: number) => {
      const response = await apiFetch(`/history/fetch-all-history?limit=${limit}`);
      const data = await response.json();

      if(!data.success) {
        console.log("Error fetching transactions data:", data.message);
        throw new Error(data.message || 'Failed to fetch transactions data');
      }
      return data.data;
    }

    // 
  },
  
  // Add other API endpoints as needed
  vtu: {
    getDataProvider: async (provider: string) => {
      const response = await apiFetch('/vtu/setsub/data-prices', {
        method: 'POST',
        body: JSON.stringify({ provider }),
      });
      const data = await response.json();
  
      if(!data.success) {
        console.log("Error fetching vtu data:", data.message);
        throw new Error(data.message || 'Failed to fetch vtu data');
      }
  
      return data.data;
    },

    getDataProviderGiftBills: async (provider: string) => {
      const response = await apiFetch(`/vtu/gb/available-data-plans/${provider}`, {
        method: 'GET'
      });
      const data = await response.json();
  
      if(!data.success) {
        console.log("Error fetching vtu data:", data.message);
        throw new Error(data.message || 'Failed to fetch vtu data');
      }
  
      return data.data;
    },

    purchaseDataGiftBills: async (data: { plan_id: number; network: string; phone: string }) => {
      const response = await apiFetch('/vtu/gb/internet/purchase-data', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      const result = await response.json();
      return result;
    },

    purchaseData: async (data: { plan_id: number; network: string; phone: string }) => {
      const response = await apiFetch('/vtu/setsub/purchase-data', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      const result = await response.json();
      return result;
    },

    purchaseAirtime: async (data: { network: string; amount: number; phone: string }) => {
      const response = await apiFetch('/vtu/setsub/purchase-airtime', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      const result = await response.json();
      return result;
    },

    // gift bill
    purchaseAirtimeGiftbill: async (data: { network: string; amount: number; phone: string }) => {
      console.log("Data to gift bill buy airtime-(api.ts): ", data);
      const response = await apiFetch('/vtu/gb/airtime/topup', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      const result = await response.json();
      return result;
    }
  },

  // VAS
  vas: {
    getBettingProviders: async () => {
      const response = await apiFetch('/vas/gb/betting');
      const data = await response.json();

      if(!data.success) {
        console.log("Error fetching betting providers:", data.message);
        throw new Error(data.message || 'Failed to fetch betting providers');
      }

      return data.data;
    }
  },

  // Accounts
  accounts: {
    fetchUserAccounts: async () => {
      const response = await apiFetch('/banking/fetch-user-virtual-accounts');
      const data = await response.json();

      if(!data.success) {
        console.log("Error fetching user accounts:", data.message);
        throw new Error(data.message || 'Failed to fetch user accounts');
      }

      console.log("(api.tsx) -- User accounts fetched successfully:");

      await AsyncStorage.setItem('user_accounts', JSON.stringify(data.data));

      return data.data;
    },

    fetchBanks: async () => {
      const response = await apiFetch('/banking/fetch-all-banks');
      const data = await response.json();

      if(!data.success) {
        console.log("Error fetching banks:", data.message);
        throw new Error(data.message || 'Failed to fetch banks');
      }

      return data.data;
    },

    // Create permanent account with flutter wave 
    createPermanentAccount: async () => {
      const response = await apiFetch('/banking/flw/create-permanent-virtual-account', {
        method: 'POST',
      });
      const data = await response.json();

      if(!data.success) {
        console.log("Error creating permanent account:", data.message);
        throw new Error(data.message || 'Failed to create permanent account');
      }

      console.log("New virtual permanent acccount successfully created")

      return data.data;
    }
  },

  // Cards
  cards: {
    fetchCards: async () => {
      const response = await apiFetch('/cards');
      const data = await response.json();

      if(!data.success) {
        console.log("Error fetching cards:", data.message);
        throw new Error(data.message || 'Failed to fetch cards');
      }

      return data.data;
    },

    createCard: async (data: {currency: string, funding_amount: string, pin: string}) => {
      try {
        const response = await apiFetch('/cards/create', {
          method: 'POST',
          body: JSON.stringify(data),
        });
        const res = await response.json();
  
        if(!res.success) {
          throw new Error(res.message || 'Failed to create card');
        }
  
        return res.data;
      } catch (error) {
        console.error("Error creating card:", error);
        throw error;
      }
    }
  },

  // Bnakings 
  banking: {
    verifyAccountNumber: async (account_number: string, bank_code: string) => {
      const response = await apiFetch('/banking/verify-account-number', {
        method: 'POST',
        body: JSON.stringify({ account_number, bank_code }),
      });
      const data = await response.json();

      if(!data.success) {
        console.log("Error verifying account number:", data.message);
        throw new Error(data.message || 'Failed to verify account number');
      }

      return data.data;
    },

    transfer: async (data: any) => {
      const response = await apiFetch('/banking/send-ngn-money', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      const res = await response.json();
  
      if(!res.success) {
        console.log("Error transferring funds:", res.message);
        throw new Error(res.message || 'Failed to transfer funds');
      } 
  
      return res.data;
    }
  },
}
