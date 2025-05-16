import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { eventEmitter } from '@/utils/eventEmitter';

interface RegisterContextType {
  formData: Record<string, any>;
  updateForm: (newData: Record<string, any>) => void;
  clearForm: () => void;
}

const STORAGE_KEY = 'register_form_data';
const RegisterContext = createContext<RegisterContextType | null>(null);

export const RegisterProvider = ({ children }: { children: ReactNode }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Clear form function
  const clearForm = async () => {
    setFormData({});
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing registration form data:', error);
    }
  };

  // Load saved form data on mount and listen for events
  useEffect(() => {
    const loadFormData = async () => {
      try {
        const savedData = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedData) {
          setFormData(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Error loading registration form data:', error);
      }
    };

    loadFormData();
    
    // Listen for registration success event
    eventEmitter.on('registration_success', clearForm);
    
    return () => {
      eventEmitter.off('registration_success', clearForm);
    };
  }, []);

  const updateForm = async (newData: Record<string, any>) => {
    const updatedData = { ...formData, ...newData };
    setFormData(updatedData);
    
    // Save to AsyncStorage
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    } catch (error) {
      console.error('Error saving registration form data:', error);
    }
  };

  return (
    <RegisterContext.Provider value={{ formData, updateForm, clearForm }}>
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegister = (): RegisterContextType => {
  const context = useContext(RegisterContext);
  if (!context) {
    throw new Error('useRegister must be used within a RegisterProvider');
  }
  return context;
};