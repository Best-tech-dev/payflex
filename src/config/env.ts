import { Platform } from 'react-native';
import { DEFAULT_DISPLAY_PICTURE } from '@env';

// Load environment variables
const ENV = {
  DEFAULT_DISPLAY_PICTURE,
};

// Validate required environment variables
const validateEnv = () => {
  if (!ENV.DEFAULT_DISPLAY_PICTURE) {
    console.warn('DEFAULT_DISPLAY_PICTURE is not set in environment variables');
  }
};

validateEnv();

export default ENV; 