import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

// Define proper type for Material Community Icons
type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface AdvertisementCardProps {
  title: string;
  description: string;
  iconName: MaterialIconName;
  buttonText: string;
  onButtonPress: () => void;
}

const AdvertisementCard: React.FC<AdvertisementCardProps> = ({
  title,
  description,
  iconName,
  buttonText,
  onButtonPress
}) => {
  return (
    <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
      <View style={{ 
        backgroundColor: colors.primary.main, 
        borderRadius: 16, 
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <View style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            width: 40, 
            height: 40, 
            borderRadius: 20, 
            alignItems: 'center', 
            justifyContent: 'center',
            marginRight: 12
          }}>
            <MaterialCommunityIcons name={iconName} size={24} color="white" />
          </View>
          <View>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>{title}</Text>
            <Text style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14 }}>{description}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={{ 
            backgroundColor: 'white', 
            paddingVertical: 8, 
            paddingHorizontal: 16, 
            borderRadius: 8, 
            alignSelf: 'flex-start'
          }}
          onPress={onButtonPress}
        >
          <Text style={{ color: colors.primary.main, fontWeight: '600' }}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdvertisementCard;