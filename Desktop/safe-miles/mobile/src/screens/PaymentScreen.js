import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme/colors';
import { CreditCard, CheckCircle } from 'lucide-react-native';

import { useAuthStore } from '../store/useAuthStore';

export default function PaymentScreen({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const amount = route.params?.amount || '500.00';

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Payment Successful', 'Your transaction was completed successfully!', [
        { text: 'Done', onPress: () => {
            if (user?.role === 'MECHANIC') {
              navigation.navigate('MechanicDashboard');
            } else if (user?.role === 'DRIVER') {
              navigation.navigate('DriverDashboard');
            } else {
              navigation.navigate('Dashboard');
            }
          }
        }
      ]);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Payment</Text>
      
      <View style={styles.card}>
        <Text style={styles.label}>Total Amount</Text>
        <Text style={styles.amount}>₹ {amount}</Text>
      </View>

      <View style={styles.methodsContainer}>
        <Text style={styles.methodsTitle}>Select Payment Method</Text>
        
        <TouchableOpacity style={styles.methodBtn}>
          <CreditCard color={Colors.primary} size={24} />
          <Text style={styles.methodText}>Credit / Debit Card</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.methodBtn}>
          <Text style={styles.upiIcon}>UPI</Text>
          <Text style={styles.methodText}>UPI (GPay, PhonePe)</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.payBtn} onPress={handlePayment} disabled={loading}>
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.payText}>Pay Now</Text>}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.md },
  title: { ...Typography.h1, color: Colors.primary, marginBottom: Spacing.xl },
  card: { backgroundColor: Colors.surface, padding: Spacing.xl, borderRadius: 12, alignItems: 'center', marginBottom: Spacing.xl, elevation: 2 },
  label: { color: Colors.textSecondary, fontSize: 16, marginBottom: 8 },
  amount: { fontSize: 36, fontWeight: 'bold', color: Colors.text },
  methodsContainer: { flex: 1 },
  methodsTitle: { ...Typography.h3, marginBottom: Spacing.md },
  methodBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: 8, marginBottom: Spacing.md, elevation: 1 },
  methodText: { marginLeft: Spacing.md, fontSize: 16, fontWeight: '500' },
  upiIcon: { color: Colors.secondary, fontWeight: 'bold', fontSize: 18 },
  payBtn: { backgroundColor: Colors.primary, padding: Spacing.lg, borderRadius: 12, alignItems: 'center', marginBottom: Spacing.xl },
  payText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 }
});
