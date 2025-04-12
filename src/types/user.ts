export interface User {
    id: string;
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    profileImage: string | null;
  }
  
  export interface Wallet {
    id: string;
    current_balance: number;
    all_time_fuunding: number;
    all_time_withdrawn: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Transaction {
    id: string;
    amount: number;
    type: string;
    description: string;
    status: string;
    date: string;
    sender: string;
    icon: string;
  }
  
  export interface DashboardData {
    user: User;
    wallet: Wallet;
    transactionHistory: Transaction[];
  }
  
  export interface DashboardResponse {
    success: boolean;
    message: string;
    data: DashboardData;
  }