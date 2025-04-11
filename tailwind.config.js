/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#0066FF',
          light: '#3385FF',
          dark: '#0047B3',
        },
        secondary: {
          main: '#6C757D',
          light: '#8A9299',
          dark: '#4A5259',
        },
        success: {
          main: '#28A745',
          light: '#5CB85C',
          dark: '#1E7E34',
        },
        error: {
          main: '#DC3545',
          light: '#E57373',
          dark: '#B71C1C',
        },
        warning: {
          main: '#FFC107',
          light: '#FFD54F',
          dark: '#FF8F00',
        },
        background: {
          default: '#FFFFFF',
          paper: '#F8F9FA',
        },
        text: {
          primary: '#212529',
          secondary: '#6C757D',
          disabled: '#ADB5BD',
        },
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        xxl: '48px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
        xxl: '24px',
      },
    },
  },
  plugins: [],
} 