// types.ts - Type definitions
export type CardType = 'physical' | 'virtual';
export type CardStatus = 'active' | 'frozen' | 'expired';
export type CardBrand = 'Mastercard' | 'Visa';

// Available currencies
export const AVAILABLE_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
];

export const CARD_CREATION_FEE = {
  physical: 5000, // 5000 NGN
  virtual: 0, // Free for virtual cards
};

export interface Card {
  id: string;
  bridge_card_id: string;
  user_id: string;
  card_currency: string;
  masked_pan: string;
  expiry_month: string;
  expiry_year: string;
  card_type: CardType;
  card_brand: CardBrand;
  first_funding_amount: number;
  current_balance: number;
  card_limit: number;
  status: CardStatus;
  is_active: boolean;
  transaction_reference: string;
  transactions?: Transaction[];
  // UI-specific properties (not from API)
  color?: string;
  cvv?: string;
  pin?: string;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  created_at: string;
  merchant_name?: string;
  merchant_category?: string;
  // Add other transaction properties as needed
}

export interface DeliveryAddress {
  fullAddress: string;
  landmark: string;
  city: string;
  state: string;
  phoneNumber: string;
}

// Helper functions
export const getCurrencySymbol = (currencyCode: string) => {
  const currency = AVAILABLE_CURRENCIES.find(c => c.code === currencyCode);
  return currency ? currency.symbol : currencyCode;
};

export function maskCardNumber(cardNumber: string): string {
  // Replace all but the last 4 digits with asterisks
  return cardNumber.replace(/\d(?=\d{4})/g, '•');
}

export const formatExpiry = (month: string, year: string) => {
  return `${month}/${year}`;
};