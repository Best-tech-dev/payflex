// File: app/(auth)/register/index.tsx
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function RegisterIndex() {
  useEffect(() => {
    router.replace('/(auth)/register/step1');
  }, []);

  return null;
}