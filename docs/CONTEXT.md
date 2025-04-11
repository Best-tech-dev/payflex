# PayFlex - Multi-Currency Fintech App

## Overview

PayFlex is a modern fintech mobile application designed to provide users with a comprehensive digital financial solution. The app focuses on multi-currency management, virtual card services, and digital payment solutions.

### Core Features

- Multi-currency account management (USD, NGN, GBP, EUR, CAD)
- Cross-currency fund transfers
- Virtual Mastercard generation (USD & NGN)
- Digital services (VTU, VAS)
- Gift card redemption
- AI-powered customer support

## Technical Stack

- **FRONTEND**: React Native with typescript, expo and expo router
- **BACKEND**: NESTJS, postgresql with prisma (No backend or authentication yet)
- **Styling**: NativeWind
- **Data**: Mock JSON files

## Project Structure

```
payflex-app/
├── apps/
│   ├── mobile/                 # React Native mobile app
│   │   ├── src/
│   │   │   ├── app/           # Expo Router app directory
│   │   │   ├── components/    # Reusable components
│   │   │   ├── constants/     # App constants
│   │   │   ├── hooks/         # Custom hooks
│   │   │   ├── services/      # API services
│   │   │   ├── store/         # State management
│   │   │   ├── types/         # TypeScript types
│   │   │   └── utils/         # Utility functions
│   │   ├── assets/            # Images, fonts, etc.
│   │   └── tests/             # Test files
│   │
│   └── web/                   # Future web admin dashboard
│
├── packages/                   # Shared packages
│   ├── api/                   # API types and utilities
│   ├── ui/                    # Shared UI components
│   └── utils/                 # Shared utilities
│
├── docs/                      # Documentation
│   ├── CONTEXT.md
│   └── API.md
│
└── package.json
```

## Database Schema

```prisma
// schema.prisma

// User Management
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  phone         String    @unique
  password      String
  firstName     String
  lastName      String
  country       String
  isVerified    Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  wallets       Wallet[]
  cards         Card[]
  transactions  Transaction[]
  beneficiaries Beneficiary[]
  kyc           Kyc?
}

// KYC Verification
model Kyc {
  id            String    @id @default(uuid())
  userId        String    @unique
  status        String    @default("PENDING") // PENDING, APPROVED, REJECTED
  documentType  String
  documentUrl   String
  selfieUrl     String
  verifiedAt    DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  user          User      @relation(fields: [userId], references: [id])
}

// Multi-Currency Wallets
model Wallet {
  id            String    @id @default(uuid())
  userId        String
  currency      String    // USD, NGN, EUR, etc.
  balance       Decimal   @default(0)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  user          User      @relation(fields: [userId], references: [id])
  transactions  Transaction[]
}

// Virtual Cards
model Card {
  id            String    @id @default(uuid())
  userId        String
  type          String    // VIRTUAL, PHYSICAL
  currency      String    // USD, NGN
  cardNumber    String
  expiryDate    DateTime
  cvv           String
  isActive      Boolean   @default(true)
  isFrozen      Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  user          User      @relation(fields: [userId], references: [id])
  transactions  Transaction[]
}

// Transactions
model Transaction {
  id            String    @id @default(uuid())
  userId        String
  type          String    // TRANSFER, CARD_PAYMENT, VTU, VAS, etc.
  status        String    // PENDING, COMPLETED, FAILED
  amount        Decimal
  currency      String
  fee           Decimal   @default(0)
  description   String?
  metadata      Json?     // Additional transaction details
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  user          User      @relation(fields: [userId], references: [id])
  wallet        Wallet?
  card          Card?
  beneficiary   Beneficiary?
}

// Beneficiaries
model Beneficiary {
  id            String    @id @default(uuid())
  userId        String
  name          String
  accountNumber String
  bankCode      String?
  bankName      String?
  currency      String
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  user          User      @relation(fields: [userId], references: [id])
  transactions  Transaction[]
}

// VTU Services
model VtuTransaction {
  id            String    @id @default(uuid())
  userId        String
  type          String    // AIRTIME, DATA
  phoneNumber   String
  amount        Decimal
  status        String    // PENDING, COMPLETED, FAILED
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  user          User      @relation(fields: [userId], references: [id])
}

// VAS Services
model VasTransaction {
  id            String    @id @default(uuid())
  userId        String
  serviceType   String    // ELECTRICITY, CABLE, BETTING, etc.
  amount        Decimal
  status        String    // PENDING, COMPLETED, FAILED
  metadata      Json      // Service-specific details
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  user          User      @relation(fields: [userId], references: [id])
}

// Gift Cards
model GiftCard {
  id            String    @id @default(uuid())
  userId        String
  type          String    // AMAZON, STEAM, etc.
  amount        Decimal
  code          String
  imageUrl      String?
  status        String    // PENDING, REDEEMED
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relations
  user          User      @relation(fields: [userId], references: [id])
}
```

## Application Structure

### 1. Onboarding Flow

Three interactive screens introducing key features:

1. **Multi-Currency Wallets**
   - Illustration
   - Headline: "Open USD, NGN, EUR & more"
   - Brief description
   - Next button

2. **Virtual Cards**
   - Illustration
   - Headline: "Shop online with Dollar or Naira cards"
   - Brief description
   - Next button

3. **Digital Services**
   - Illustration
   - Headline: "Top-up airtime, pay bills & more"
   - Brief description
   - Get Started button

### 2. Authentication Screens

#### Login Screen
- Email/Phone input field
- Password input field
- Forgot Password link
- Login button

#### Registration Screen
- Full Name input
- Email input
- Phone Number input
- Password & Confirm Password fields
- Country selection (dropdown)
- Register button

### 3. Main Navigation

Five-tab bottom navigation structure:

#### Home Tab
- Wallet balance display
- Recent transactions (3 items)
- Quick Actions Grid:
  - Fund Wallet
  - Send Money
  - Receive Money
  - Generate Cards
  - Airtime/Data
  - Pay Bills
  - Redeem Gift Card
- Floating Chat Support icon

#### Cards Tab
- Virtual Card Display:
  - USD Card
  - NGN Card
- Card Features:
  - Card design preview
  - Masked card number
  - Available balance
  - Card management options
- New Card Generation button

#### Transfers Tab
- Send Money section
- Receive Money section
- Currency selection
- Amount input
- Beneficiary details
- Recent transfers list

#### Services Tab

##### VTU Services
- Airtime top-up
- Data purchase
- Airtime to Naira conversion

##### VAS Services
- Electricity bill payment
- DSTV/GOTV subscriptions
- Sports betting payments
- WAEC/NECO result pins

##### Gift Card Services
- Card redemption interface
- Card type selection
- Value input
- Image upload (mock)

#### Profile Tab
- Profile image
- User information display
- Edit profile option
- Settings:
  - Notification preferences
  - Security settings
  - Theme selection (Light/Dark)
- Logout option

### 4. Chat Support

- Floating chat icon (Home screen)
- Full-screen modal interface
- AI chatbot UI
- Message input field
- Sample conversation display

## Mock Data Structure

```json
{
  "wallets": {
    "balances": {},
    "currencies": []
  },
  "transactions": [],
  "userProfile": {},
  "virtualCards": [],
  "beneficiaries": [],
  "serviceHistory": {
    "vtu": [],
    "vas": []
  },
  "giftCards": []
}
```

## Future Enhancements

- KYC verification system
- Dark mode implementation
- Notifications center
- User feedback system
- Referral program interface

## Development Guidelines

1. Use React Navigation for routing
2. Implement mock data using JSON files
3. Utilize NativeWind or Styled Components for styling
4. Consider `react-native-credit-card` for card UI components
5. Maintain consistent design patterns throughout the app
