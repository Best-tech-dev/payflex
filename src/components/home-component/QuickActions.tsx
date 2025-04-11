import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { useRouter } from 'expo-router';

// Define proper type for Material Community Icons
type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;

interface QuickActionItem {
  id: string;
  title: string;
  icon: MaterialIconName;
  route: string;
}

interface QuickActionsProps {
  actions: QuickActionItem[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  const router = useRouter();
  
  return (
    <View style={{ paddingHorizontal: 24, marginBottom: 6 }}>
      <Text style={{ fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 16 }}>Quick Actions</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {actions.map((action) => (
          <TouchableOpacity 
            key={action.id}
            onPress={() => router.push(action.route)}
            style={{ 
              backgroundColor: 'white', 
              width: '22%', 
              alignItems: 'center', 
              padding: 8, 
              borderRadius: 12, 
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: 1 }, 
              shadowOpacity: 0.1, 
              shadowRadius: 2, 
              marginBottom: 16, 
              marginHorizontal: 4 
            }}
          >
            <MaterialCommunityIcons name={action.icon} size={24} color={colors.primary.main} style={{ marginBottom: 4 }} />
            <Text style={{ fontSize: 10, color: '#4B5563', textAlign: 'center' }}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default QuickActions;