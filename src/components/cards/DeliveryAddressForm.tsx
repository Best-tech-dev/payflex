// components/DeliveryAddressForm.tsx
import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { DeliveryAddress } from '../../types/cards';

interface DeliveryAddressFormProps {
  deliveryAddress: DeliveryAddress;
  setDeliveryAddress: (address: DeliveryAddress) => void;
}

const DeliveryAddressForm = ({ deliveryAddress, setDeliveryAddress }: DeliveryAddressFormProps) => {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: '#6B7280', fontSize: 14, marginBottom: 4 }}>Delivery Address</Text>
      
      <View style={{ marginBottom: 12 }}>
        <Text style={{ color: '#6B7280', fontSize: 12, marginBottom: 4 }}>Full Address</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
          }}
          placeholder="Enter full house address"
          value={deliveryAddress.fullAddress}
          onChangeText={(text) => setDeliveryAddress({ ...deliveryAddress, fullAddress: text })}
          multiline
          numberOfLines={2}
        />
      </View>
      
      <View style={{ marginBottom: 12 }}>
        <Text style={{ color: '#6B7280', fontSize: 12, marginBottom: 4 }}>Landmark</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
          }}
          placeholder="Enter nearby landmark"
          value={deliveryAddress.landmark}
          onChangeText={(text) => setDeliveryAddress({ ...deliveryAddress, landmark: text })}
        />
      </View>
      
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#6B7280', fontSize: 12, marginBottom: 4 }}>City</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
            }}
            placeholder="Enter city"
            value={deliveryAddress.city}
            onChangeText={(text) => setDeliveryAddress({ ...deliveryAddress, city: text })}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#6B7280', fontSize: 12, marginBottom: 4 }}>State</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#E5E7EB',
              borderRadius: 8,
              padding: 12,
              fontSize: 16,
            }}
            placeholder="Enter state"
            value={deliveryAddress.state}
            onChangeText={(text) => setDeliveryAddress({ ...deliveryAddress, state: text })}
          />
        </View>
      </View>
      
      <View>
        <Text style={{ color: '#6B7280', fontSize: 12, marginBottom: 4 }}>Phone Number for Pickup</Text>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
          }}
          placeholder="Enter phone number"
          value={deliveryAddress.phoneNumber}
          onChangeText={(text) => setDeliveryAddress({ ...deliveryAddress, phoneNumber: text })}
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );
};

export default DeliveryAddressForm;