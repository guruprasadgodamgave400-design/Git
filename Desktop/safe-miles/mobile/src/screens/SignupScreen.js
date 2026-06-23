import { api } from '../api/config';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { Colors, Spacing, Typography } from '../theme/colors';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, Lock, Phone, User as UserIcon } from 'lucide-react-native';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('TRAVELER');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSignup = async () => {
    if (!email || !password || !phone || !name) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (loading) return;
    setLoading(true);
    try {
      const response = await api.post('/auth/signup', {
        email,
        password,
        phone,
        name,
        role,
      });
      await setAuth(response.data.user, response.data.access_token);
    } catch (error) {
      if (error.response?.status === 409) {
        Alert.alert('Account exists', 'Please login instead');
        return;
      }
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image 
          source={require('../../assets/branding/logo.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join SaarthiMitra for reliable assistance</Text>
      </View>
      <Input
        icon={UserIcon}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <Input
        icon={Mail}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <Input
        icon={Phone}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Input
        icon={Lock}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Select Your Role</Text>
      <View style={styles.roleContainer}>
        {['TRAVELER', 'DRIVER', 'MECHANIC'].map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.roleButton, role === r && styles.roleButtonActive]}
            onPress={() => setRole(r)}
          >
            <Text style={[styles.roleButtonText, role === r && styles.roleButtonTextActive]}>
              {r.charAt(0) + r.slice(1).toLowerCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button 
        title="Sign Up" 
        onPress={handleSignup} 
        loading={loading} 
        style={{ marginTop: Spacing.sm }} 
      />

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.link}>
        <Text style={styles.linkText}>Already have an account? <Text style={{ color: Colors.primary }}>Sign In</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.caption,
    textAlign: 'center',
  },
  header: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h1,
    color: Colors.primary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  label: {
    color: Colors.text,
    fontSize: 14,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  roleButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    backgroundColor: Colors.surface,
  },
  roleButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(37, 99, 235, 0.1)', // Primary blue transparent
  },
  roleButtonText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  roleButtonTextActive: {
    color: Colors.primary,
  },
  link: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  linkText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});
