import React from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';

// Define proper type for Material Community Icons
type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface FloatingActionButtonProps {
  iconName: MaterialIconName;
  onPress: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ iconName, onPress }) => {
  return (
    <TouchableOpacity 
      style={{ 
        position: 'absolute', 
        bottom: 24, 
        right: 24, 
        backgroundColor: colors.primary.main, 
        width: 56, 
        height: 56, 
        borderRadius: 999, 
        alignItems: 'center', 
        justifyContent: 'center', 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 }, 
        shadowOpacity: 0.25, 
        shadowRadius: 3.84 
      }}
      onPress={onPress}
    >
      <MaterialCommunityIcons name={iconName} size={24} color="white" />
    </TouchableOpacity>
  );
};

export default FloatingActionButton;