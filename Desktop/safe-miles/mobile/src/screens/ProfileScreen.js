import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing } from '../theme/colors';
import { useAuthStore } from '../store/useAuthStore';
import { User, FileText, Settings, LogOut, CheckCircle } from 'lucide-react-native';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { clearAuth } from '../services/auth';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    if (typeof clearAuth !== 'function') {
      console.error('clearAuth not defined');
    }
    await clearAuth();
    // Also use the store's logout to trigger state change and unmount the authenticated navigation stack
    await logout(); 
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <User color={Colors.background} size={40} />
        </View>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <Text style={styles.role}>{user?.role || 'TRAVELER'}</Text>
      </View>

      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconBox}>
            <CheckCircle color={Colors.success} size={24} />
          </View>
          <View style={styles.info}>
            <Text style={styles.infoTitle}>Verification Status</Text>
            <Text style={styles.infoDesc}>Verified User</Text>
          </View>
        </View>
      </Card>

      <Text style={styles.sectionTitle}>Account</Text>

      <TouchableOpacity style={styles.menuItem}>
        <FileText color={Colors.textSecondary} size={24} style={styles.menuIcon} />
        <Text style={styles.menuText}>My Documents</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <Settings color={Colors.textSecondary} size={24} style={styles.menuIcon} />
        <Text style={styles.menuText}>Settings</Text>
      </TouchableOpacity>

      <Button 
        title="Logout" 
        variant="danger" 
        onPress={handleLogout} 
        style={styles.logoutBtn} 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.text,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  name: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
  },
  role: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  card: {
    marginBottom: Spacing.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
  },
  infoTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoDesc: {
    color: Colors.textSecondary,
    marginTop: 4,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuIcon: {
    marginRight: Spacing.md,
  },
  menuText: {
    color: Colors.text,
    fontSize: 16,
  },
  logoutBtn: {
    marginTop: Spacing.xl,
  },
});
