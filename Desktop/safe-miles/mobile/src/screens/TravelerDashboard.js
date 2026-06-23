import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography } from '../theme/colors';
import { AlertTriangle, User, MessageCircle, ShieldCheck, MapPin } from 'lucide-react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const { height } = Dimensions.get('window');

const mockMechanics = [
  { id: '1', name: "Garage A", distance: "2 km", lat: 18.5204, lng: 73.8567 },
  { id: '2', name: "Mechanic B", distance: "3 km", lat: 18.5304, lng: 73.8467 }
];

export default function TravelerDashboard({ navigation }) {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    })();
  }, []);

  const handleSOS = () => navigation.navigate('SOSActivation');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back</Text>
          <Text style={[Typography.h2, { color: Colors.text }]}>SaarthiMitra</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileBtn}>
          <User color={Colors.text} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={StyleSheet.absoluteFill}
          provider={PROVIDER_GOOGLE}
          region={{
            latitude: location?.latitude || 18.5204,
            longitude: location?.longitude || 73.8567,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {location && <Marker coordinate={location} title="You" pinColor="blue" />}
          {mockMechanics.map(m => (
            <Marker key={m.id} coordinate={{ latitude: m.lat, longitude: m.lng }} title={m.name} description={m.distance} pinColor="orange" />
          ))}
        </MapView>
        
        <View style={styles.sosOverlay}>
          <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
            <AlertTriangle color="#FFF" size={32} />
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Nearby Services</Text>
        {mockMechanics.map(m => (
          <View key={m.id} style={styles.serviceCard}>
            <MapPin color={Colors.secondary} size={20} />
            <Text style={styles.serviceName}>{m.name}</Text>
            <Text style={styles.serviceDistance}>{m.distance}</Text>
          </View>
        ))}

        <View style={styles.grid}>
          <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Chatbot')}>
            <MessageCircle color={Colors.primary} size={28} />
            <Text style={styles.gridText}>AI Assistant</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridItem} onPress={() => navigation.navigate('Payment')}>
            <ShieldCheck color={Colors.success} size={28} />
            <Text style={styles.gridText}>Payments</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingBottom: Spacing.md,
  },
  greeting: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mapContainer: {
    height: height * 0.4,
    marginHorizontal: Spacing.md,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  sosOverlay: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  sosButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  sosText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 2,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    marginBottom: Spacing.md,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.sm,
    elevation: 2,
  },
  serviceName: {
    flex: 1,
    marginLeft: Spacing.sm,
    fontSize: 16,
    fontWeight: 'bold',
  },
  serviceDistance: {
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  gridItem: {
    backgroundColor: Colors.surface,
    width: '48%',
    padding: Spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  gridText: {
    color: Colors.text,
    marginTop: Spacing.sm,
    fontSize: 14,
    fontWeight: '600',
  },
});
