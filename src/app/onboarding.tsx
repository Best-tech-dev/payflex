import React, { useState } from 'react';
import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { onboardingSlides, OnboardingSlide } from '@/types/onboarding';
import { Button } from '@/components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { colors } from '@/theme/colors';

const { width } = Dimensions.get('window');

export default function Onboarding() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // const handleNext = async () => {
  //   if (currentSlideIndex < onboardingSlides.length - 1) {
  //     setCurrentSlideIndex(currentSlideIndex + 1);
  //   } else {
  //     // Mark onboarding as complete
  //     await AsyncStorage.setItem('has_seen_onboarding', 'true');
  //     router.replace('/(auth)/login');
  //   }
  // };

  const handleNext = async () => {
    if (currentSlideIndex < onboardingSlides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      // Mark onboarding as complete
      await AsyncStorage.setItem('has_seen_onboarding', 'true');
  
      // Explicitly clear authentication state
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('pin_setup_complete');
      await AsyncStorage.removeItem('app_pin');
  
      // Redirect to login
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = async () => {
    // Mark onboarding as complete
    await AsyncStorage.setItem('has_seen_onboarding', 'true');
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* Skip Button */}
        <View className="absolute top-4 right-4 z-10">
          <Button
            title="Skip"
            variant="text"
            onPress={handleSkip}
            className="px-4"
          />
        </View>

        {/* Carousel */}
        <View className="flex-1 justify-center">
          {onboardingSlides.map((slide: OnboardingSlide, index: number) => (
            <View
              key={slide.id}
              style={[
                styles.slide,
                { transform: [{ translateX: (index - currentSlideIndex) * width }] },
              ]}
            >
              {/* Centered Icon */}
              <View style={styles.iconContainer}>
                <Image
                  source={slide.icon}
                  style={styles.icon}
                  resizeMode="contain"
                />
              </View>

              {/* Content */}
              <View className="px-8 mt-8">
                <Text className="text-2xl font-bold text-center text-gray-900 mb-2">
                  {slide.title}
                </Text>
                <Text className="text-base text-center text-gray-600">
                  {slide.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Progress Bar */}
        <View className="flex-row justify-center items-center mb-12">
          {onboardingSlides.map((_: OnboardingSlide, index: number) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentSlideIndex ? styles.activeDot : null
              ]}
            />
          ))}
        </View>

        {/* Next Button */}
        <View className="px-8 mb-8">
          <Button
            title={currentSlideIndex === onboardingSlides.length - 1 ? 'Get Started' : 'Next'}
            onPress={handleNext}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  slide: {
    position: 'absolute',
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: width * 0.5,
    height: width * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: '#3B82F6',
  },
}); 