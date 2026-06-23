import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme/colors';
import { Bell, MapPin, Check, X, User } from 'lucide-react-native';
import SocketService from '../services/SocketService';
import { useAuthStore } from '../store/useAuthStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function MechanicDashboard({ navigation }) {
  const { user } = useAuthStore();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    SocketService.connect();
    SocketService.emit('join_room', { userId: user.id, role: 'MECHANIC' });

    SocketService.on('new_sos_request', (request) => {
      setRequests((prev) => [request, ...prev]);
      Alert.alert('New Emergency', `New SOS request near your location!`);
    });

    return () => SocketService.disconnect();
  }, []);

  const handleResponse = (requestId, status) => {
    SocketService.emit('respond_sos', {
      requestId,
      mechanicId: user.id,
      status,
    });

    if (status === 'ACCEPTED') {
      setRequests((prev) => prev.filter(r => r.id !== requestId));
      navigation.navigate('LiveTracking', { requestId, role: 'MECHANIC' });
    } else {
      setRequests((prev) => prev.filter(r => r.id !== requestId));
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Emergency Help Needed</Text>
        <Text style={styles.timeText}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
      </View>
      
      <View style={styles.cardBody}>
        <View style={styles.row}>
          <MapPin color={Colors.secondary} size={16} />
          <Text style={styles.locationText}>Lat: {item.lat.toFixed(4)}, Lng: {item.lng.toFixed(4)}</Text>
        </View>
        <Text style={styles.distanceText}>~2.4 km away</Text>

        {item.images && item.images.length > 0 && (
          <ScrollView horizontal style={styles.imageScroll} showsHorizontalScrollIndicator={false}>
            {item.images.map((img, i) => (
              <Image key={i} source={{ uri: img }} style={styles.damageThumb} />
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.actions}>
        <Button 
          title="Reject" 
          variant="danger" 
          size="small" 
          onPress={() => handleResponse(item.id, 'REJECTED')} 
          style={{ width: '48%', backgroundColor: 'rgba(239, 68, 68, 0.2)', borderWidth: 1, borderColor: Colors.danger }} 
        />
        <Button 
          title="Accept" 
          variant="primary" 
          size="small" 
          onPress={() => handleResponse(item.id, 'ACCEPTED')} 
          style={{ width: '48%', backgroundColor: Colors.success }} 
        />
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Mechanic Dashboard</Text>
          <Text style={styles.status}>Online & Available</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.iconBtn}>
            <Bell color={Colors.text} size={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Profile')}>
            <User color={Colors.text} size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Active Emergency Requests</Text>
      
      <FlatList
        data={requests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No active SOS requests in your area.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  welcome: {
    ...Typography.h2,
    color: Colors.text,
  },
  status: {
    color: Colors.success,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  iconBtn: {
    marginLeft: Spacing.md,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  card: {
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  cardBody: {
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
    fontSize: 14,
  },
  distanceText: {
    color: Colors.secondary,
    fontSize: 14,
    marginTop: 4,
    fontWeight: '600',
  },
  imageScroll: {
    marginTop: Spacing.md,
    flexDirection: 'row',
  },
  damageThumb: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  empty: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    fontSize: 16,
  },
});
