import React, { useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, Modal, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { useRouter } from 'expo-router';

interface Currency {
  code: string;
  symbol: string;
  flag: string;
}

const currencies: Currency[] = [
  { code: 'NGN', symbol: '₦', flag: '🇳🇬' },
  { code: 'USD', symbol: '$', flag: '🇺🇸' },
  { code: 'GBP', symbol: '£', flag: '🇬🇧' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺' },
];

export interface WalletCardProps {
  balance: string;
  income: string;
  expenses: string;
  loading?: boolean;
  error?: string | null;
  onPress: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({ 
  balance, 
  income, 
  expenses, 
  loading = false,
  error = null,
  onPress 
}) => {
  const router = useRouter();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  if (loading) {
    return (
      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <View style={{ 
          backgroundColor: 'white', 
          borderRadius: 16, 
          padding: 20,
          alignItems: 'center',
          justifyContent: 'center',
          height: 160,
          shadowColor: '#000', 
          shadowOffset: { width: 0, height: 2 }, 
          shadowOpacity: 0.1, 
          shadowRadius: 8,
          elevation: 4
        }}>
          <ActivityIndicator size="large" color={colors.primary.main} />
          <Text style={{ color: colors.primary.main, marginTop: 8 }}>Fetching balance...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
        <TouchableOpacity 
          onPress={onPress}
          style={{ 
            backgroundColor: 'white', 
            borderRadius: 16, 
            padding: 20,
            alignItems: 'center',
            justifyContent: 'center',
            height: 160,
            shadowColor: '#000', 
            shadowOffset: { width: 0, height: 2 }, 
            shadowOpacity: 0.1, 
            shadowRadius: 8,
            elevation: 4
          }}
        >
          <MaterialCommunityIcons name="refresh" size={32} color={colors.primary.main} />
          <Text style={{ color: colors.primary.main, marginTop: 8, textAlign: 'center' }}>
            Unable to load wallet data
          </Text>
          <Text style={{ color: colors.primary.main, fontSize: 12, marginTop: 4, textAlign: 'center' }}>
            Tap to retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
      <View style={{ 
        backgroundColor: 'white', 
        borderRadius: 16, 
        padding: 16,
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.1, 
        shadowRadius: 8,
        elevation: 4
      }}>
        {/* Main Content Container */}
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          {/* Currency Selector */}
          <TouchableOpacity 
            onPress={() => setShowCurrencyModal(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#F5F5F5',
              paddingVertical: 6,
              paddingHorizontal: 10,
              borderRadius: 10,
              marginBottom: 12
            }}
          >
            <Text style={{ fontSize: 14, marginRight: 4 }}>{selectedCurrency.flag}</Text>
            <Text style={{ fontSize: 14, color: '#333', marginRight: 4, fontWeight: '500' }}>
              {selectedCurrency.code}
            </Text>
            <MaterialCommunityIcons name="chevron-down" size={16} color="#666" />
          </TouchableOpacity>

          {/* Balance Display */}
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Total Balance</Text>
            <Text style={{ 
              fontSize: 28, 
              fontWeight: '700', 
              color: '#333',
              letterSpacing: 0.5
            }}>
              {selectedCurrency.symbol}{balance}
            </Text>
          </View>

          {/* Bank Account Button - Only show for NGN */}
          {selectedCurrency.code === 'NGN' && (
            <TouchableOpacity 
              onPress={() => router.push('/account-details')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#F5F5F5',
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: 20,
                marginTop: 12
              }}
            >
              <MaterialCommunityIcons name="bank" size={16} color="#666" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 12, color: '#666' }}>Get Your NG Bank Account</Text>
              <MaterialCommunityIcons name="chevron-right" size={16} color="#666" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          )}
        </View>

        {/* Stats Row */}
        {/* <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'center',
          alignItems: 'center',
          gap: 24,
          marginBottom: 16
        }}> */}
          {/* Income Section */}
          {/* <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <MaterialCommunityIcons name="arrow-down" size={16} color="#00A86B" style={{ marginRight: 4 }} />
            <View>
              <Text style={{ color: '#666', fontSize: 10 }}>Income</Text>
              <Text style={{ color: '#00A86B', fontWeight: '600', fontSize: 14 }}>
                {selectedCurrency.symbol}{income}
              </Text>
            </View>
          </View> */}
          
          {/* Vertical Divider */}
          {/* <View style={{ 
            width: 1, 
            height: 24,
            backgroundColor: '#E0E0E0'
          }} /> */}
          
          {/* Expenses Section */}
          {/* <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <MaterialCommunityIcons name="arrow-up" size={16} color="#FF4B55" style={{ marginRight: 4 }} />
            <View>
              <Text style={{ color: '#666', fontSize: 10 }}>Expenses</Text>
              <Text style={{ color: '#FF4B55', fontWeight: '600', fontSize: 14 }}>
                {selectedCurrency.symbol}{expenses}
              </Text>
            </View>
          </View>
        </View> */}

        {/* Quick Actions */}
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'center',
          gap: 24
        }}>
          {/* Add Money */}
          <TouchableOpacity 
            style={{ alignItems: 'center' }}
            onPress={() => router.push('/funding')}
          >
            <View style={{
              width: 32,
              height: 32,
              backgroundColor: '#F5F5F5',
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 4
            }}>
              <MaterialCommunityIcons name="plus" size={18} color="#333" />
            </View>
            <Text style={{ fontSize: 10, color: '#666' }}>Add Money</Text>
          </TouchableOpacity>

          {/* Send */}
          <TouchableOpacity 
            style={{ alignItems: 'center' }}
            onPress={() => router.push('/(app)/transfers')}
          >
            <View style={{
              width: 32,
              height: 32,
              backgroundColor: '#F5F5F5',
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 4
            }}>
              <MaterialCommunityIcons name="arrow-top-right" size={18} color="#333" />
            </View>
            <Text style={{ fontSize: 10, color: '#666' }}>Send</Text>
          </TouchableOpacity>

          {/* Convert */}
          <TouchableOpacity 
            style={{ alignItems: 'center' }}
            onPress={() => router.push('/convert')}
          >
            <View style={{
              width: 32,
              height: 32,
              backgroundColor: '#F5F5F5',
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 4
            }}>
              <MaterialCommunityIcons name="sync" size={18} color="#333" />
            </View>
            <Text style={{ fontSize: 10, color: '#666' }}>Convert</Text>
          </TouchableOpacity>
        </View>

        {/* Currency Selection Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showCurrencyModal}
          onRequestClose={() => setShowCurrencyModal(false)}
        >
          <Pressable 
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'flex-end'
            }}
            onPress={() => setShowCurrencyModal(false)}
          >
            <View style={{
              backgroundColor: 'white',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24
            }}>
              <View style={{
                width: 40,
                height: 4,
                backgroundColor: '#E0E0E0',
                borderRadius: 2,
                alignSelf: 'center',
                marginBottom: 24
              }} />
              
              <Text style={{ 
                fontSize: 20, 
                fontWeight: '600', 
                marginBottom: 16,
                color: '#333'
              }}>
                Select Currency
              </Text>
              
              {currencies.map((currency) => (
                <TouchableOpacity
                  key={currency.code}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    borderRadius: 12,
                    backgroundColor: selectedCurrency.code === currency.code ? '#F5F5F5' : 'transparent',
                    marginBottom: 8
                  }}
                  onPress={() => {
                    setSelectedCurrency(currency);
                    setShowCurrencyModal(false);
                  }}
                >
                  <Text style={{ fontSize: 24, marginRight: 12 }}>{currency.flag}</Text>
                  <Text style={{ fontSize: 16, color: '#333', fontWeight: '500' }}>{currency.code}</Text>
                  {selectedCurrency.code === currency.code && (
                    <MaterialCommunityIcons 
                      name="check-circle" 
                      size={24} 
                      color={colors.primary.main}
                      style={{ marginLeft: 'auto' }}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>
      </View>
    </View>
  );
};

export default WalletCard;