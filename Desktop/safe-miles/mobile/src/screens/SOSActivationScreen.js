import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { Colors, Spacing, Typography } from '../theme/colors';
import { AlertCircle, MapPin, X, CheckCircle, Star, Clock } from 'lucide-react-native';
import SocketService from '../services/SocketService';
import * as Location from 'expo-location';
import { useAuthStore } from '../store/useAuthStore';
import DamageUpload from '../components/DamageUpload';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SOSActivationScreen({ navigation }) {
  const { user } = useAuthStore();
  const [status, setStatus] = useState('IDLE'); // IDLE, COUNTDOWN, SEARCHING, RESULTS_FOUND, NO_RESULTS, ERROR, ASSIGNED, OFFLINE_QUEUED
  const [countdown, setCountdown] = useState(3);
  const [location, setLocation] = useState(null);
  const [damageImages, setDamageImages] = useState([]);
  
  const [internalMechanics, setInternalMechanics] = useState([]);
  const [nearbyGarages, setNearbyGarages] = useState([]);
  const [searchMessage, setSearchMessage] = useState('');

  useEffect(() => {
    SocketService.connect();
    return () => SocketService.disconnect();
  }, []);

  const startSOS = async () => {
    const { status: locStatus } = await Location.requestForegroundPermissionsAsync();
    if (locStatus !== 'granted') {
      Alert.alert('Permission Denied', 'Location access is required for SOS.');
      return;
    }

    const currentLoc = await Location.getCurrentPositionAsync({});
    setLocation(currentLoc.coords);
    setStatus('COUNTDOWN');
  };

  useEffect(() => {
    let timer;
    if (status === 'COUNTDOWN' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (status === 'COUNTDOWN' && countdown === 0) {
      triggerRealSOS();
    }
    return () => clearTimeout(timer);
  }, [status, countdown]);

  const triggerRealSOS = async () => {
    const payload = {
      userId: user.id,
      lat: location.latitude,
      lng: location.longitude,
      vehicleId: 'MH-12-AB-1234',
      images: damageImages,
    };

    if (SocketService.socket && SocketService.socket.connected) {
      setStatus('SEARCHING');
      
      try {
        const response = await SocketService.emitWithAck('trigger_sos', payload);
        
        if (response) {
          if (response.status === 'SUCCESS') {
            setInternalMechanics(response.internalMechanics || []);
            setNearbyGarages(response.nearbyGarages || []);
            setStatus('RESULTS_FOUND');
          } else {
            setSearchMessage(response.message || 'No nearby services found.');
            setStatus('NO_RESULTS');
          }
        } else {
          setSearchMessage('Invalid response from server.');
          setStatus('ERROR');
        }

        SocketService.on(`sos_response_${user.id}`, (res) => {
          if (res.status === 'ACCEPTED') {
            setStatus('ASSIGNED');
            navigation.navigate('LiveTracking', { requestId: res.requestId, role: 'TRAVELER' });
          }
        });
      } catch (error) {
        setSearchMessage('API connection failed.');
        setStatus('ERROR');
      }
    } else {
      setStatus('OFFLINE_QUEUED');
      await AsyncStorage.setItem('queued_sos', JSON.stringify(payload));
    }
  };

  const cancelSOS = () => {
    setStatus('IDLE');
    setCountdown(3);
  };

  const renderServiceCard = (item, type) => (
    <View key={item.id} style={styles.serviceCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <View style={styles.badge(type)}>
          <Text style={styles.badgeText}>{type}</Text>
        </View>
      </View>
      
      <View style={styles.cardRow}>
        <MapPin size={16} color={Colors.textSecondary} />
        <Text style={styles.cardText}>{item.distance}</Text>
        
        <Star size={16} color="#F59E0B" style={{ marginLeft: 12 }} />
        <Text style={styles.cardText}>{item.rating} Rating</Text>
        
        <Clock size={16} color={item.open ? Colors.success : Colors.danger} style={{ marginLeft: 12 }} />
        <Text style={[styles.cardText, { color: item.open ? Colors.success : Colors.danger }]}>
          {item.open ? 'Open' : 'Closed'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {status === 'IDLE' && (
        <View style={styles.center}>
          <TouchableOpacity style={styles.sosCircle} onPress={startSOS}>
            <Text style={styles.sosLabel}>SOS</Text>
          </TouchableOpacity>
          <Text style={styles.hint}>One tap to trigger emergency help</Text>
          <View style={{ width: '100%', marginTop: Spacing.xl }}>
            <DamageUpload onImagesUploaded={(urls) => setDamageImages(urls)} />
          </View>
        </View>
      )}

      {status === 'COUNTDOWN' && (
        <View style={styles.center}>
          <Text style={styles.countdownText}>{countdown}</Text>
          <Text style={styles.warning}>SOS Triggering in {countdown}s...</Text>
          <TouchableOpacity style={styles.cancelBtn} onPress={cancelSOS}>
            <X color={Colors.text} size={24} />
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === 'SEARCHING' && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.danger} />
          <Text style={styles.statusText}>Scanning for nearby help...</Text>
        </View>
      )}

      {status === 'RESULTS_FOUND' && (
        <View style={StyleSheet.absoluteFill}>
          <View style={{ height: '45%' }}>
            <MapView
              style={StyleSheet.absoluteFill}
              initialRegion={{
                latitude: location?.latitude || 0,
                longitude: location?.longitude || 0,
                latitudeDelta: 0.08,
                longitudeDelta: 0.08,
              }}
            >
              <Marker coordinate={location} pinColor="red" title="You are here" />
              {internalMechanics.map(m => (
                <Marker
                  key={m.id}
                  coordinate={{ latitude: m.lat, longitude: m.lng }}
                  pinColor="blue"
                  title={m.name}
                  description="Verified Mechanic"
                />
              ))}
              {nearbyGarages.map(g => (
                <Marker
                  key={g.id}
                  coordinate={{ latitude: g.lat, longitude: g.lng }}
                  pinColor="orange"
                  title={g.name}
                  description="Google Garage"
                />
              ))}
            </MapView>
          </View>
          
          <ScrollView style={styles.listContainer}>
            <Text style={styles.resultsTitle}>Found Nearby Help</Text>
            
            {internalMechanics.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Verified SaarthiMitra Mechanics</Text>
                {internalMechanics.map(m => renderServiceCard(m, 'VERIFIED'))}
              </View>
            )}

            {nearbyGarages.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Nearby Google Garages</Text>
                {nearbyGarages.map(g => renderServiceCard(g, 'GARAGE'))}
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {(status === 'NO_RESULTS' || status === 'ERROR') && (
        <View style={styles.center}>
          <AlertCircle color={Colors.danger} size={64} />
          <Text style={styles.statusText}>{searchMessage}</Text>
          <TouchableOpacity style={styles.trackBtn} onPress={cancelSOS}>
            <Text style={styles.trackBtnText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === 'ASSIGNED' && (
        <View style={styles.center}>
          <CheckCircle color={Colors.success} size={64} />
          <Text style={styles.statusText}>Help Dispatched!</Text>
          <TouchableOpacity style={styles.trackBtn} onPress={() => navigation.navigate('LiveTracking')}>
            <Text style={styles.trackBtnText}>Track Mechanic</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === 'OFFLINE_QUEUED' && (
        <View style={styles.center}>
          <AlertCircle color={Colors.warning} size={64} />
          <Text style={styles.statusText}>No Internet Connection</Text>
          <Text style={styles.hint}>Your SOS is queued and will be sent automatically when back online.</Text>
          <TouchableOpacity style={styles.cancelBtn} onPress={cancelSOS}>
            <X color={Colors.text} size={24} />
            <Text style={styles.cancelText}>Cancel SOS</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  sosCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 25,
    shadowColor: Colors.danger,
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  sosLabel: {
    color: Colors.text,
    fontSize: 48,
    fontWeight: 'bold',
  },
  hint: {
    color: Colors.textSecondary,
    marginTop: Spacing.xl,
    fontSize: 16,
  },
  countdownText: {
    fontSize: 120,
    fontWeight: 'bold',
    color: Colors.danger,
  },
  warning: {
    color: Colors.text,
    fontSize: 20,
    marginTop: Spacing.md,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xl,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: 12,
  },
  cancelText: {
    color: Colors.text,
    marginLeft: Spacing.sm,
    fontSize: 18,
  },
  statusText: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '600',
    marginTop: Spacing.xl,
    textAlign: 'center',
  },
  trackBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: 12,
    marginTop: Spacing.xl,
  },
  trackBtnText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
    marginTop: -20,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  serviceCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    flex: 1,
  },
  badge: (type) => ({
    backgroundColor: type === 'VERIFIED' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  }),
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.text,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  cardText: {
    color: Colors.textSecondary,
    marginLeft: 6,
    fontSize: 14,
  },
});
