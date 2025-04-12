import AsyncStorage from '@react-native-async-storage/async-storage';

export const logout = async (): Promise<void> => {
  try {
    // Clear authentication data
    // await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('pin_setup_complete');
    await AsyncStorage.removeItem('app_pin');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}; 