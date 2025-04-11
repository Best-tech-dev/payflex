import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

interface NavbarProps {
  userName: string;
}

const Navbar: React.FC<NavbarProps> = ({ userName }) => {
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutPress = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {

    logout();
    setShowLogoutModal(false);
    
    router.replace('/(auth)/login');
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <View style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left: Welcome Text */}
        <View className='flex-row items-center gap-2'>
          <Image
            source={require('@/assets/images/bernard-2.png')}
            style={{ width: 32, height: 32 }}
          />
          <View>
            <Text style={{ color: '#6B7280', fontSize: 14 }}>Welcome back</Text>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#111827' }}>{userName}</Text>
          </View>
        </View>

        {/* Right: Icons container */}
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              padding: 8,
              borderRadius: 999,
              marginRight: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
            }}
          >
            <MaterialCommunityIcons name="menu" size={24} color="#111827" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              padding: 8,
              borderRadius: 999,
              marginRight: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
            }}
          >
            <MaterialCommunityIcons name="bell-outline" size={24} color="#111827" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: 'white',
              padding: 8,
              borderRadius: 999,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
            }}
            onPress={handleLogoutPress}
          >
            <MaterialCommunityIcons name="logout" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleLogoutCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={handleLogoutCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.logoutButton]} 
                onPress={handleLogoutConfirm}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827',
  },
  modalText: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
  },
  cancelButtonText: {
    color: '#4B5563',
    fontWeight: '600',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default Navbar;