import { api } from '../api/config';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { Colors, Spacing } from '../theme/colors';
import { useAuthStore } from '../store/useAuthStore';
import { Phone, Key, User as UserIcon } from 'lucide-react-native';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function LoginScreen({ navigation }) {
  const [step, setStep] = useState('PHONE'); // PHONE, OTP, ROLE
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [role, setRole] = useState('DRIVER');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSendOTP = () => {
    if (phone.length < 10) {
      Alert.alert('Error', 'कृपया सही मोबाइल नंबर डालें (Enter a valid 10-digit mobile number)');
      return;
    }
    setLoading(true);
    // Mock OTP sending
    setTimeout(() => {
      setLoading(false);
      setStep('OTP');
      Alert.alert('OTP Sent', 'Mock OTP is 123456');
    }, 1000);
  };

  const handleVerifyOTP = async () => {
    if (otp !== '123456') {
      Alert.alert('Error', 'गलत OTP (Invalid OTP). Please use 123456.');
      return;
    }
    setStep('ROLE');
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Backend automatically registers or logs in based on phone number alone!
      const response = await api.post('/auth/otp', {
        phone,
        role,
      });
      await setAuth(response.data.user, response.data.access_token);
    } catch (error) {
      console.log('Authentication failed error:', error.message);
      Alert.alert('Error', 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Image 
            source={require('../../assets/branding/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>SaarthiMitra</Text>
          <Text style={styles.subtitle}>Driving Safety, Delivering Trust</Text>
        </View>

        <View style={styles.card}>
          {step === 'PHONE' && (
            <>
              <Text style={styles.label}>मोबाइल नंबर (Mobile Number)</Text>
              <Input
                icon={Phone}
                placeholder="9876543210"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
                style={styles.largeInput}
              />
              <Button 
                title="OTP प्राप्त करें (Get OTP)" 
                onPress={handleSendOTP} 
                loading={loading} 
                style={styles.largeButton} 
              />
            </>
          )}

          {step === 'OTP' && (
            <>
              <Text style={styles.label}>OTP दर्ज करें (Enter 6-digit OTP)</Text>
              <Input
                icon={Key}
                placeholder="123456"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                style={styles.largeInput}
              />
              <Button 
                title="सत्यापित करें (Verify)" 
                onPress={handleVerifyOTP} 
                style={styles.largeButton} 
              />
            </>
          )}

          {step === 'ROLE' && (
            <>
              <Text style={styles.label}>आप कौन हैं? (Who are you?)</Text>
              
              <TouchableOpacity 
                style={[styles.roleCard, role === 'DRIVER' && styles.roleCardActive]}
                onPress={() => setRole('DRIVER')}
              >
                <UserIcon color={role === 'DRIVER' ? Colors.primary : Colors.textSecondary} size={32} />
                <Text style={[styles.roleText, role === 'DRIVER' && styles.roleTextActive]}>चालक (Driver)</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.roleCard, role === 'MECHANIC' && styles.roleCardActive]}
                onPress={() => setRole('MECHANIC')}
              >
                <UserIcon color={role === 'MECHANIC' ? Colors.secondary : Colors.textSecondary} size={32} />
                <Text style={[styles.roleText, role === 'MECHANIC' && styles.roleTextActive]}>मैकेनिक (Mechanic)</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.roleCard, role === 'TRAVELER' && styles.roleCardActive]}
                onPress={() => setRole('TRAVELER')}
              >
                <UserIcon color={role === 'TRAVELER' ? Colors.primary : Colors.textSecondary} size={32} />
                <Text style={[styles.roleText, role === 'TRAVELER' && styles.roleTextActive]}>यात्री (Traveler)</Text>
              </TouchableOpacity>

              <Button 
                title="आगे बढ़ें (Continue)" 
                onPress={handleComplete} 
                loading={loading}
                style={styles.largeButton} 
              />
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.secondary,
    marginTop: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 0, 0.1)',
  },
  label: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  largeInput: {
    height: 64,
    fontSize: 24,
    textAlign: 'center',
    letterSpacing: 2,
  },
  largeButton: {
    height: 64,
    marginTop: Spacing.xl,
    borderRadius: 16,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 16,
    marginBottom: Spacing.md,
  },
  roleCardActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(255, 107, 0, 0.05)',
  },
  roleText: {
    color: Colors.textSecondary,
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: Spacing.lg,
  },
  roleTextActive: {
    color: Colors.primary,
  },
});
