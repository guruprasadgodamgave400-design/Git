import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Spacing } from '../../theme/colors';

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'large', 
  loading = false, 
  disabled = false,
  style 
}) {
  const getBgColor = () => {
    if (disabled) return Colors.surface;
    switch (variant) {
      case 'primary': return Colors.primary;
      case 'secondary': return Colors.secondary;
      case 'danger': return Colors.danger;
      case 'outline': return 'transparent';
      default: return Colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return Colors.textSecondary;
    if (variant === 'outline') return Colors.primary;
    return Colors.text;
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { 
          backgroundColor: getBgColor(),
          paddingVertical: size === 'large' ? Spacing.md : Spacing.sm,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor: Colors.primary
        },
        style
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor(), fontSize: size === 'large' ? 18 : 16 }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.5,
  }
});
