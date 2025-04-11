export const mockUser = {
  id: '1',
  email: 'user@example.com',
  phone: '+1234567890',
  firstName: 'John',
  lastName: 'Doe',
  country: 'US',
  isVerified: true,
};

export const mockWallets = [
  {
    id: '1',
    userId: '1',
    currency: 'USD',
    balance: 1000.00,
    isActive: true,
  },
  {
    id: '2',
    userId: '1',
    currency: 'NGN',
    balance: 50000.00,
    isActive: true,
  },
];

export const mockCards = [
  {
    id: '1',
    userId: '1',
    type: 'VIRTUAL',
    currency: 'USD',
    cardNumber: '**** **** **** 1234',
    expiryDate: '2025-12-31',
    isActive: true,
    isFrozen: false,
  },
  {
    id: '2',
    userId: '1',
    type: 'VIRTUAL',
    currency: 'NGN',
    cardNumber: '**** **** **** 5678',
    expiryDate: '2025-12-31',
    isActive: true,
    isFrozen: false,
  },
];

export const mockTransactions = [
  {
    id: '1',
    userId: '1',
    type: 'TRANSFER',
    status: 'COMPLETED',
    amount: 100.00,
    currency: 'USD',
    fee: 1.00,
    description: 'Transfer to Jane Doe',
    createdAt: '2024-04-01T10:00:00Z',
  },
  {
    id: '2',
    userId: '1',
    type: 'CARD_PAYMENT',
    status: 'COMPLETED',
    amount: 50.00,
    currency: 'USD',
    fee: 0.50,
    description: 'Amazon Purchase',
    createdAt: '2024-04-02T15:30:00Z',
  },
];

export const mockBeneficiaries = [
  {
    id: '1',
    userId: '1',
    name: 'Jane Doe',
    accountNumber: '1234567890',
    bankCode: '001',
    bankName: 'Example Bank',
    currency: 'USD',
    isActive: true,
  },
];

export const mockVtuTransactions = [
  {
    id: '1',
    userId: '1',
    type: 'AIRTIME',
    phoneNumber: '+1234567890',
    amount: 10.00,
    status: 'COMPLETED',
    createdAt: '2024-04-03T09:00:00Z',
  },
];

export const mockVasTransactions = [
  {
    id: '1',
    userId: '1',
    serviceType: 'ELECTRICITY',
    amount: 50.00,
    status: 'COMPLETED',
    metadata: {
      meterNumber: '123456789',
      provider: 'Example Power',
    },
    createdAt: '2024-04-04T14:00:00Z',
  },
];

export const mockGiftCards = [
  {
    id: '1',
    userId: '1',
    type: 'AMAZON',
    amount: 100.00,
    code: 'XXXX-XXXX-XXXX-XXXX',
    status: 'REDEEMED',
    createdAt: '2024-04-05T11:00:00Z',
  },
]; 