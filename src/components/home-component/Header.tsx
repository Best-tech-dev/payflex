import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Header() {
  return (
    <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View className='flex-row items-center gap-2'>
          <Image
            source={require('@/assets/images/avatar.png')}
            style={{ width: 32, height: 32 }}
          />
          <View>
            <Text style={{ color: '#6B7280', fontSize: 14 }}>Welcome back</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>Mayowa</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={iconContainerStyle}>
            <MaterialCommunityIcons name="menu" size={24} color="#111827" />
          </TouchableOpacity>
          <TouchableOpacity style={iconContainerStyle}>
            <MaterialCommunityIcons name="bell" size={24} color="#111827" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const iconContainerStyle = {
  backgroundColor: 'white',
  padding: 8,
  borderRadius: 999,
  marginLeft: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
};