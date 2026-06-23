import { api } from '../api/config';
import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/useAuthStore';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import TravelerDashboard from '../screens/TravelerDashboard';
import MechanicDashboard from '../screens/MechanicDashboard';
import SOSActivationScreen from '../screens/SOSActivationScreen';
import LiveTrackingScreen from '../screens/LiveTrackingScreen';
import NotificationListScreen from '../screens/NotificationListScreen';
import VerificationUploadScreen from '../screens/VerificationUploadScreen';
import SplashScreen from '../screens/SplashScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import ProfileScreen from '../screens/ProfileScreen';
import DriverDashboard from '../screens/DriverDashboard';
import DamageUploadScreen from '../screens/DamageUploadScreen';
import PaymentScreen from '../screens/PaymentScreen';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Colors } from '../theme/colors';

const Stack = createStackNavigator();

export default function AppNavigation() {
  const { user, token, isLoading, loadAuth } = useAuthStore();
  const [kycStatus, setKycStatus] = useState(null);
  const [checkingKyc, setCheckingKyc] = useState(false);
  const [splashFinished, setSplashFinished] = useState(false);

  const isMounted = useRef(true);
  const lastCheckedToken = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    loadAuth();
    return () => {
      isMounted.current = false;
    };
  }, []);

  const checkStatus = async (tokenToCheck) => {
    if (!tokenToCheck) return;

    setCheckingKyc(true);
    try {
      const response = await api.get('/verification/status', {
        headers: { Authorization: `Bearer ${tokenToCheck}` }
      });
      if (isMounted.current && tokenToCheck === lastCheckedToken.current) {
        setKycStatus(response.data?.kycStatus || 'PENDING');
      }
    } catch (e) {
      console.warn('KYC status check failed:', e.message);
      if (isMounted.current && tokenToCheck === lastCheckedToken.current) {
        setKycStatus('PENDING');
      }
    } finally {
      if (isMounted.current && tokenToCheck === lastCheckedToken.current) {
        setCheckingKyc(false);
      }
    }
  };

  useEffect(() => {
    if (user && token) {
      if (user.role === 'TRAVELER') {
        setKycStatus('APPROVED');
        setCheckingKyc(false);
      } else if (user.role === 'DRIVER' || user.role === 'MECHANIC') {
        if (lastCheckedToken.current !== token) {
          lastCheckedToken.current = token;
          checkStatus(token);
        }
      }
    } else {
      lastCheckedToken.current = null;
      setKycStatus(null);
      setCheckingKyc(false);
    }
  }, [user, token]);

  if (!splashFinished) {
    return <SplashScreen onFinish={() => setSplashFinished(true)} />;
  }

  if (isLoading || checkingKyc) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <>
            {/* If unverified, Verification is the very first screen so it acts as initialRoute */}
            {user.role !== 'TRAVELER' && kycStatus !== 'APPROVED' && (
              <Stack.Screen name="Verification" component={VerificationUploadScreen} />
            )}
            
            {/* Primary Dashboards */}
            {user.role === 'MECHANIC' ? (
              <Stack.Screen name="MechanicDashboard" component={MechanicDashboard} />
            ) : user.role === 'DRIVER' ? (
              <Stack.Screen name="DriverDashboard" component={DriverDashboard} />
            ) : (
              <Stack.Screen name="Dashboard" component={TravelerDashboard} />
            )}
            
            {/* Common Authenticated Screens (Available to everyone) */}
            <Stack.Screen name="SOSActivation" component={SOSActivationScreen} />
            <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} />
            <Stack.Screen name="Notifications" component={NotificationListScreen} />
            <Stack.Screen name="Chatbot" component={ChatbotScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="DamageUpload" component={DamageUploadScreen} />
            <Stack.Screen name="Payment" component={PaymentScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});
