import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

const FORM_KEY = 'register_form_data';

const useRegisterForm = () => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    AsyncStorage.getItem(FORM_KEY).then((stored) => {
      if (stored) setFormData(JSON.parse(stored));
    });
  }, []);

interface FormData {
    [key: string]: any;
}

const updateForm = async (newData: Partial<FormData>): Promise<void> => {
    const updated: FormData = { ...formData, ...newData };
    setFormData(updated);
    await AsyncStorage.setItem(FORM_KEY, JSON.stringify(updated));
};

  const clearForm = async () => {
    setFormData({});
    await AsyncStorage.removeItem(FORM_KEY);
  };

  return { formData, updateForm, clearForm };
};

export default useRegisterForm;
