import { API_URL, api } from '../api/config';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors, Spacing, Typography } from '../theme/colors';
import { Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react-native';

import { useAuthStore } from '../store/useAuthStore';

export default function NotificationListScreen() {
  const { token } = useAuthStore();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data);
    } catch (error) {
      console.log('Fetch notifications error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.log('Mark read error:', error.message);
    }
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'SOS_ASSIGNED': return <CheckCircle color={Colors.success} size={24} />;
      case 'SOS_CREATED': return <AlertTriangle color={Colors.danger} size={24} />;
      default: return <Info color={Colors.primary} size={24} />;
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.card, !item.isRead && styles.unreadCard]} 
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.iconContainer}>
        {renderIcon(item.type)}
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, !item.isRead && styles.unreadText]}>{item.title}</Text>
        <Text style={styles.message}>{item.message}</Text>
        <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
      </View>
      {!item.isRead && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Bell color={Colors.textSecondary} size={64} />
              <Text style={styles.emptyText}>No notifications yet.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.lg,
    marginTop: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    ...Typography.h2,
    color: Colors.text,
  },
  list: {
    padding: Spacing.md,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  unreadCard: {
    borderColor: 'rgba(52, 199, 89, 0.3)',
    backgroundColor: 'rgba(52, 199, 89, 0.05)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  unreadText: {
    color: Colors.text,
  },
  message: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  time: {
    color: Colors.textSecondary,
    fontSize: 12,
    opacity: 0.6,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.success,
    marginLeft: Spacing.sm,
  },
  empty: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    fontSize: 16,
  },
});
