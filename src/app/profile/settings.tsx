import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Switch } from '@/components/common/Switch';
import { Button } from '@/components/Button';
import { ErrorModal } from '@/components/ErrorModal';
import { SuccessModal } from '@/components/SuccessModal';
import { colors } from '@/constants/theme';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogout = () => {
    // In a real app, this would clear auth tokens and user data
    router.replace('/');
  };

  const handleDeleteAccount = () => {
    setErrorMessage('Are you sure you want to delete your account? This action cannot be undone.');
    setShowError(true);
  };

  const handleChangePassword = () => {
    router.push('/profile/change-password');
  };

  const handlePrivacyPolicy = () => {
    // Navigate to privacy policy
  };

  const handleTermsOfService = () => {
    // Navigate to terms of service
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    description: string,
    rightElement: React.ReactNode
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <MaterialCommunityIcons name={icon} size={24} color={colors.primary.main} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      {rightElement}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          {renderSettingItem(
            'bell-outline',
            'Notifications',
            'Receive updates about your account',
            <Switch
              value={notifications}
              onChange={setNotifications}
            />
          )}
          
          {renderSettingItem(
            'fingerprint',
            'Biometric Authentication',
            'Use fingerprint or face ID to login',
            <Switch
              value={biometrics}
              onChange={setBiometrics}
            />
          )}
          
          {renderSettingItem(
            'theme-light-dark',
            'Dark Mode',
            'Switch between light and dark theme',
            <Switch
              value={darkMode}
              onChange={setDarkMode}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleChangePassword}
          >
            <View style={styles.settingIcon}>
              <MaterialCommunityIcons name="lock-outline" size={24} color={colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Change Password</Text>
              <Text style={styles.settingDescription}>Update your account password</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handlePrivacyPolicy}
          >
            <View style={styles.settingIcon}>
              <MaterialCommunityIcons name="shield-outline" size={24} color={colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
              <Text style={styles.settingDescription}>Read our privacy policy</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#6B7280" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleTermsOfService}
          >
            <View style={styles.settingIcon}>
              <MaterialCommunityIcons name="file-document-outline" size={24} color={colors.primary.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Terms of Service</Text>
              <Text style={styles.settingDescription}>Read our terms of service</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity
            style={[styles.settingItem, styles.dangerItem]}
            onPress={handleDeleteAccount}
          >
            <View style={styles.settingIcon}>
              <MaterialCommunityIcons name="delete-outline" size={24} color={colors.error.main} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, styles.dangerText]}>Delete Account</Text>
              <Text style={styles.settingDescription}>Permanently delete your account</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.error.main} />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Log Out"
            variant="outline"
            onPress={handleLogout}
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccess}
        title="Settings Updated"
        message="Your settings have been updated successfully."
        onClose={() => setShowSuccess(false)}
      />

      {/* Error Modal */}
      <ErrorModal
        visible={showError}
        title="Delete Account"
        message={errorMessage}
        onClose={() => setShowError(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  dangerItem: {
    borderWidth: 1,
    borderColor: colors.error.main,
  },
  dangerText: {
    color: colors.error.main,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  logoutButton: {
    marginBottom: 16,
  },
}); 