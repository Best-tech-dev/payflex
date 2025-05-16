import React, { useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Dimensions,
  Platform,
  TouchableWithoutFeedback 
} from 'react-native';
import { colors, typography } from '@/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface ErrorModalProps {
  visible: boolean;
  error: string;
  onClose: () => void;
  title?: string; // Optional custom title
  icon?: string; // Optional custom icon name from MaterialIcons
  iconColor?: string; // Optional custom icon color
  actionButtonText?: string; // Optional custom button text
  showCloseIcon?: boolean; // Optional close icon in the corner
  onBackdropPress?: () => void; // Optional backdrop press handler
}

export function ErrorModal({ 
  visible, 
  error, 
  onClose,
  title = "Error",
  icon = "error-outline",
  iconColor = colors.error.main,
  actionButtonText = "OK",
  showCloseIcon = true,
  onBackdropPress
}: ErrorModalProps) {
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Reset animations when modal is hidden
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
    }
  }, [visible, scaleAnim, opacityAnim]);

  const handleBackdropPress = () => {
    if (onBackdropPress) {
      onBackdropPress();
    } else if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none" // We'll handle animations ourselves
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <Animated.View 
              style={[
                styles.modalContent,
                {
                  opacity: opacityAnim,
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              {showCloseIcon && (
                <TouchableOpacity 
                  style={styles.closeButton} 
                  onPress={onClose}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  <MaterialIcons name="close" size={20} color={colors.text.secondary} />
                </TouchableOpacity>
              )}
              
              <View style={styles.iconContainer}>
                <MaterialIcons name={icon as keyof typeof MaterialIcons.glyphMap} size={48} color={iconColor} />
              </View>
              
              <Text style={styles.title}>{title}</Text>
              
              <Text style={styles.message}>{error}</Text>
              
              <TouchableOpacity 
                style={styles.button} 
                onPress={onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>{actionButtonText}</Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const { width } = Dimensions.get('window');
const modalWidth = width * 0.85 > 400 ? 400 : width * 0.85;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: modalWidth,
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.fontSize.md,
    color: colors.text.secondary,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    backgroundColor: colors.error.main,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
    minWidth: 120,
  },
  buttonText: {
    color: 'white',
    fontSize: typography.fontSize.md,
    fontWeight: '600',
    textAlign: 'center',
  },
});