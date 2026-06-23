import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme/colors';
import { AlertTriangle, MapPin, Settings } from 'lucide-react-native';

export default function DriverDashboard({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Driver Dashboard</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Settings color={Colors.text} size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Vehicle Status</Text>
          <Text style={styles.cardText}>Registration: MH 12 AB 1234</Text>
          <Text style={styles.cardText}>Status: Active</Text>
        </View>

        <View style={styles.sosContainer}>
          <TouchableOpacity 
            style={styles.sosButton}
            onPress={() => navigation.navigate('SOSActivation')}
          >
            <AlertTriangle color="#FFF" size={48} />
            <Text style={styles.sosText}>EMERGENCY SOS</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('DamageUpload')}
        >
          <Text style={styles.actionText}>Upload Vehicle Damage</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.lg },
  title: { ...Typography.h1, color: Colors.primary },
  card: { backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: 12, marginBottom: Spacing.lg },
  cardTitle: { ...Typography.h3, marginBottom: Spacing.sm },
  cardText: { ...Typography.body, color: Colors.textSecondary },
  sosContainer: { alignItems: 'center', marginVertical: Spacing.xl },
  sosButton: {
    backgroundColor: Colors.error,
    width: 200, height: 200, borderRadius: 100,
    justifyContent: 'center', alignItems: 'center',
    elevation: 8, shadowColor: Colors.error, shadowOpacity: 0.5, shadowRadius: 10,
  },
  sosText: { color: '#FFF', fontWeight: 'bold', fontSize: 20, marginTop: 10 },
  actionButton: { backgroundColor: Colors.secondary, padding: Spacing.md, borderRadius: 8, alignItems: 'center' },
  actionText: { color: '#FFF', fontWeight: 'bold' }
});
