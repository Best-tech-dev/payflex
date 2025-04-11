import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { Loader } from '@/components/Loader';
import { router } from 'expo-router';

// Mock data for network providers
const NETWORK_PROVIDERS = [
  { id: '1', name: 'MTN', code: 'MTN' },
  { id: '2', name: 'Airtel', code: 'AIRTEL' },
  { id: '3', name: 'Glo', code: 'GLO' },
  { id: '4', name: '9mobile', code: '9MOBILE' },
];

// Mock data for data bundles
const DATA_BUNDLES = [
  { id: '1', name: 'Daily', amount: 200, data: '1GB', validity: '24 hours' },
  { id: '2', name: 'Weekly', amount: 1000, data: '5GB', validity: '7 days' },
  { id: '3', name: 'Monthly', amount: 3000, data: '15GB', validity: '30 days' },
  { id: '4', name: 'Monthly Plus', amount: 5000, data: '30GB', validity: '30 days' },
];

export default function VTUServices() {
  const [selectedTab, setSelectedTab] = useState<'airtime' | 'data'>('airtime');
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [showDataBundleModal, setShowDataBundleModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<{ id: string; name: string; code: string } | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('08146694787');
  const [amount, setAmount] = useState('500');
  const [selectedBundle, setSelectedBundle] = useState<{ id: string; name: string; amount: number; data: string; validity: string } | null>();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const handlePurchase = () => {
    setShowLoading(true);
    // Simulate API call
    setTimeout(() => {
      setShowLoading(false);
      setShowSuccessModal(true);
      // Reset form
      setPhoneNumber('');
      setAmount('');
      setSelectedProvider(null);
      setSelectedBundle(null);
    }, 2000);
  };

  const renderProviderModal = () => (
    <Modal
      visible={showProviderModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowProviderModal(false)}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 16,
            padding: 24,
          }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}>
              <TouchableOpacity onPress={() => setShowProviderModal(false)}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
              </TouchableOpacity>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>
                Select Network
              </Text>
              <TouchableOpacity 
                onPress={() => setShowProviderModal(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#EF4444',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialCommunityIcons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {NETWORK_PROVIDERS.map(provider => (
                <TouchableOpacity
                  key={provider.id}
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: '#E5E7EB',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    setSelectedProvider(provider);
                    setShowProviderModal(false);
                  }}
                >
                  <View style={{ 
                    width: 40, 
                    height: 40, 
                    borderRadius: 20, 
                    backgroundColor: '#F3F4F6',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <MaterialCommunityIcons name="cellphone" size={24} color={colors.primary.main} />
                  </View>
                  <Text style={{ fontSize: 16, color: '#111827' }}>{provider.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderDataBundleModal = () => (
    <Modal
      visible={showDataBundleModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowDataBundleModal(false)}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 16,
            padding: 24,
          }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 24,
            }}>
              <TouchableOpacity onPress={() => setShowDataBundleModal(false)}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
              </TouchableOpacity>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>
                Select Data Bundle
              </Text>
              <TouchableOpacity 
                onPress={() => setShowDataBundleModal(false)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#EF4444',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialCommunityIcons name="close" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {DATA_BUNDLES.map(bundle => (
                <TouchableOpacity
                  key={bundle.id}
                  style={{
                    paddingVertical: 16,
                    paddingHorizontal: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: '#E5E7EB',
                  }}
                  onPress={() => {
                    setSelectedBundle(bundle);
                    setShowDataBundleModal(false);
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827' }}>{bundle.name}</Text>
                      <Text style={{ color: '#6B7280', fontSize: 14 }}>{bundle.data} • {bundle.validity}</Text>
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: colors.primary.main }}>
                      ₦{bundle.amount}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );

  const renderSuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowSuccessModal(false)}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <View style={{ 
            backgroundColor: 'white', 
            borderRadius: 16,
            padding: 32,
            alignItems: 'center',
            width: '100%',
          }}>
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              marginBottom: 24,
            }}>
              <View style={{ width: 24 }} />
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#111827' }}>
                Purchase Successful
              </Text>
              <TouchableOpacity 
                onPress={() => setShowSuccessModal(false)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 16,
                  // backgroundColor: 'green',
                  alignItems: 'center',
                  justifyContent: 'center',
                  
                }}
              >
                <MaterialCommunityIcons name="close" size={20} color="black" />
              </TouchableOpacity>
            </View>

            <View style={{ 
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#D1FAE5',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}>
              <MaterialCommunityIcons name="check" size={40} color="#065F46" />
            </View>

            <Text style={{ color: '#6B7280', fontSize: 16, textAlign: 'center', marginBottom: 24 }}>
              {selectedTab === 'airtime' 
                ? `Your airtime purchase of ₦${amount} for ${phoneNumber} was successful`
                : `Your data bundle purchase of ${selectedBundle?.data} for ${phoneNumber} was successful`}
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: colors.primary.main,
                padding: 16,
                borderRadius: 12,
                width: '100%',
                alignItems: 'center',
              }}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>VTU Services</Text>
      </View>

      <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
        <View style={{ 
          flexDirection: 'row', 
          backgroundColor: '#F3F4F6', 
          borderRadius: 12,
          padding: 4,
        }}>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 8,
              backgroundColor: selectedTab === 'airtime' ? 'white' : 'transparent',
              alignItems: 'center',
            }}
            onPress={() => setSelectedTab('airtime')}
          >
            <Text style={{ 
              color: selectedTab === 'airtime' ? '#111827' : '#6B7280',
              fontWeight: '500',
            }}>
              Airtime
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 8,
              backgroundColor: selectedTab === 'data' ? 'white' : 'transparent',
              alignItems: 'center',
            }}
            onPress={() => setSelectedTab('data')}
          >
            <Text style={{ 
              color: selectedTab === 'data' ? '#111827' : '#6B7280',
              fontWeight: '500',
            }}>
              Data
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }}>
        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 4 }}>Phone Number</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
            }}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>

        {selectedTab === 'airtime' ? (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 4 }}>Amount</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 8,
                padding: 12,
                fontSize: 16,
              }}
              placeholder="Enter amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>
        ) : (
          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 4 }}>Data Bundle</Text>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 8,
                padding: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onPress={() => setShowDataBundleModal(true)}
            >
              <Text style={{ color: selectedBundle ? '#111827' : '#9CA3AF', fontSize: 16 }}>
                {selectedBundle ? `${selectedBundle.name} - ${selectedBundle.data}` : 'Select data bundle'}
              </Text>
              <MaterialCommunityIcons name="chevron-down" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        )}

        <View style={{ marginBottom: 24 }}>
          <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 4 }}>Network Provider</Text>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 8,
              padding: 12,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onPress={() => setShowProviderModal(true)}
          >
            <Text style={{ color: selectedProvider ? '#111827' : '#9CA3AF', fontSize: 16 }}>
              {selectedProvider ? selectedProvider.name : 'Select network provider'}
            </Text>
            <MaterialCommunityIcons name="chevron-down" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: colors.primary.main,
            padding: 16,
            borderRadius: 12,
            alignItems: 'center',
            opacity: (phoneNumber && ((selectedTab === 'airtime' && amount) || (selectedTab === 'data' && selectedBundle)) && selectedProvider) ? 1 : 0.5,
          }}
          disabled={!phoneNumber || ((selectedTab === 'airtime' && !amount) || (selectedTab === 'data' && !selectedBundle)) || !selectedProvider}
          onPress={handlePurchase}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
            {selectedTab === 'airtime' ? 'Buy Airtime' : 'Buy Data'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
        style={{ 
          padding: 16, 
          borderRadius: 12, 
          alignItems: 'center' 
        }}
        onPress={() => router.push('/home')}>
          <Text style={{ color: 'black', fontSize: 16, fontWeight: '300' }}>
            Home
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {renderProviderModal()}
      {renderDataBundleModal()}
      {renderSuccessModal()}
      <Loader visible={showLoading} message="Processing purchase..." />
    </SafeAreaView>
  );
} 