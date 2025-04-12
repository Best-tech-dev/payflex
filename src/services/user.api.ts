import { DashboardResponse } from "@/types/user";
import { apiFetch } from "./api";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const api_version = "/api/v1"

export const userApi = {

    getUserDashboard: async (): Promise<DashboardResponse> => {

        const response = await fetch(`${api_version}/user/fetch-user-dashboard`);
        console.log("Response from fetch dashboard api", response); 

        if (!response.ok) {
        throw new Error('Failed to fetch user dashboard');
        }
        const data = await response.json();
        return data;
    },

    login: (email: string, password: string) => 
        apiFetch('/auth/signin', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }),

    wallet: {
        getWallet: async () => {
          const response = await apiFetch('/wallet');
          const data = await response.json();
    
          if (!data.success) {
            throw new Error(data.message || 'Failed to fetch wallet data');
          }
    
          return data.data; // Return wallet data
        },
      },
    
      transactions: {
        getTransactionHistory: async () => {
          const response = await apiFetch('/transactions');
          const data = await response.json();
    
          if (!data.success) {
            throw new Error(data.message || 'Failed to fetch transaction history');
          }
    
          return data.data; // Return transaction history
        },
      },
    
    updateUserProfile: async (userData: any) => {
        const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        });
        if (!response.ok) {
        throw new Error('Failed to update user profile');
        }
        const data = await response.json();
        return data;
    },
    
    getTransactionHistory: async () => {
        const response = await fetch('/api/user/transactions');
        if (!response.ok) {
        throw new Error('Failed to fetch transaction history');
        }
        const data = await response.json();
        return data;
    },
}