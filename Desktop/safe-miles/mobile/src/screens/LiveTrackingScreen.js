import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import { Colors, Spacing, Typography } from '../theme/colors';
import { Navigation, Phone, ShieldCheck } from 'lucide-react-native';
import SocketService from '../services/SocketService';
import { useAuthStore } from '../store/useAuthStore';
import { DEMO_MODE } from '../api/config';

const { width, height } = Dimensions.get('window');

export default function LiveTrackingScreen({ route, navigation }) {
  const { requestId, role } = route.params;
  const { user } = useAuthStore();
  
  const [driverLoc, setDriverLoc] = useState(null);
  const [mechanicLoc, setMechanicLoc] = useState(null);
  const [eta, setEta] = useState('--');
  const [distance, setDistance] = useState('--');
  
  const mapRef = useRef(null);

  useEffect(() => {
    SocketService.emit('join_sos_room', { requestId });

    // Watch our own location
    let locationSubscription;
    const startTracking = async () => {
      if (DEMO_MODE) {
        // Skip watchPosition in demo mode to prevent jumpy markers
        return;
      }
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        locationSubscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.High, distanceInterval: 10 },
          (loc) => {
            const newPos = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
            
            if (role === 'MECHANIC') setMechanicLoc(newPos);
            else setDriverLoc(newPos);

            SocketService.emit('update_location', {
              userId: user.id,
              requestId,
              lat: newPos.latitude,
              lng: newPos.longitude,
              role,
            });
          }
        );
      } catch (e) {
        console.warn('Location tracking subscription failed:', e.message);
      }
    };

    startTracking();

    // Listen for peer location
    SocketService.on('location_update', (data) => {
      const peerPos = { latitude: data.lat, longitude: data.lng };
      if (data.role === 'MECHANIC') setMechanicLoc(peerPos);
      else setDriverLoc(peerPos);
    });

    // SIMULATION FOR DEMO MODE
    let demoInterval;
    if (DEMO_MODE) {
      console.log('[Demo Mode] Initializing LiveTracking route simulation');
      const userBase = { latitude: 18.5204, longitude: 73.8567 };
      const peerBase = { latitude: 18.5254, longitude: 73.8607 }; // Offset by ~600m
      
      if (role === 'MECHANIC') {
        setMechanicLoc(peerBase);
        setDriverLoc(userBase);
      } else {
        setDriverLoc(userBase);
        setMechanicLoc(peerBase);
      }

      setDistance('1.2');
      setEta('8');

      let step = 0;
      const totalSteps = 20;

      demoInterval = setInterval(() => {
        step++;
        if (step <= totalSteps) {
          const ratio = step / totalSteps;
          const currentPeerLat = 18.5254 - (18.5254 - 18.5204) * ratio;
          const currentPeerLng = 73.8607 - (73.8607 - 73.8567) * ratio;
          const peerPos = { latitude: currentPeerLat, longitude: currentPeerLng };
          
          setMechanicLoc(peerPos);

          const remainingDist = (1.2 * (1 - ratio)).toFixed(1);
          const remainingEta = Math.ceil(8 * (1 - ratio));
          setDistance(remainingDist);
          setEta(remainingEta === 0 ? '0' : String(remainingEta));
        } else {
          clearInterval(demoInterval);
          setDistance('0.0');
          setEta('0');
          console.log('[Demo Mode] LiveTracking simulation complete - mechanic arrived');
        }
      }, 3000);
    }

    return () => {
      if (locationSubscription) locationSubscription.remove();
      if (demoInterval) clearInterval(demoInterval);
    };
  }, []);

  useEffect(() => {
    if (driverLoc && mechanicLoc) {
      // Auto zoom to fit both markers
      mapRef.current?.fitToCoordinates([driverLoc, mechanicLoc], {
        edgePadding: { top: 100, right: 100, bottom: 300, left: 100 },
        animated: true,
      });
    }
  }, [driverLoc, mechanicLoc]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 18.5204,
          longitude: 73.8567,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {driverLoc && (
          <Marker coordinate={driverLoc} title="Traveler" pinColor={Colors.primary} />
        )}
        {mechanicLoc && (
          <Marker coordinate={mechanicLoc} title="Mechanic" pinColor={Colors.secondary} />
        )}
        
        {/* Directions would go here if API key is provided */}
        {driverLoc && mechanicLoc && (
          <Polyline
            coordinates={[driverLoc, mechanicLoc]}
            strokeWidth={4}
            strokeColor={Colors.primary}
          />
        )}
      </MapView>

      <View style={styles.infoCard}>
        <View style={styles.header}>
          <Text style={styles.statusLabel}>
            {role === 'MECHANIC' ? 'Navigating to Traveler' : 'Mechanic is En Route'}
          </Text>
          <View style={styles.etaBadge}>
            <Text style={styles.etaText}>{eta} mins</Text>
          </View>
        </View>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Navigation size={20} color={Colors.primary} />
            <Text style={styles.detailValue}>{distance} km away</Text>
          </View>
          <TouchableOpacity style={styles.callBtn}>
            <Phone size={20} color={Colors.text} />
            <Text style={styles.callText}>Call</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.arrivedBtn} 
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              if (role === 'MECHANIC') {
                navigation.replace('MechanicDashboard');
              } else if (role === 'DRIVER') {
                navigation.replace('DriverDashboard');
              } else {
                navigation.replace('Dashboard');
              }
            }
          }}
        >
          <ShieldCheck size={20} color={Colors.text} />
          <Text style={styles.arrivedText}>Confirm Arrival</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.xl,
    paddingBottom: 40,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  statusLabel: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  etaBadge: {
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: 8,
  },
  etaText: {
    color: Colors.success,
    fontWeight: 'bold',
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailValue: {
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
    fontSize: 16,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    borderRadius: 12,
  },
  callText: {
    color: Colors.text,
    marginLeft: Spacing.sm,
    fontWeight: '600',
  },
  arrivedBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
  },
  arrivedText: {
    color: Colors.text,
    marginLeft: Spacing.sm,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
