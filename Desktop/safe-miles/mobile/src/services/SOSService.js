import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { api } from '../api/config';

const SOS_TASK_NAME = 'BACKGROUND_SOS_TASK';

// Define the background task
TaskManager.defineTask(SOS_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error('SOS Task Error:', error);
    return;
  }
  if (data) {
    const { locations } = data;
    const { latitude, longitude } = locations[0].coords;

    // Send location update to backend if SOS is active
    try {
      // Retrieve SOS status from local storage or state
      // await axios.post('/sos/update-location', { lat: latitude, lng: longitude });
      console.log('Background Location Update:', latitude, longitude);
    } catch (e) {
      console.error('Failed to sync background location:', e);
    }
  }
});

export const SOSService = {
  async startTracking() {
    const { status } = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Background location permission required for SOS reliability.');
    }

    await Location.startLocationUpdatesAsync(SOS_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 10000, // 10 seconds
      distanceInterval: 10, // 10 meters
      foregroundService: {
        notificationTitle: 'SaarthiMitra SOS Active',
        notificationBody: 'Your location is being tracked for emergency assistance.',
      },
    });
  },

  async stopTracking() {
    const isRunning = await Location.hasStartedLocationUpdatesAsync(SOS_TASK_NAME);
    if (isRunning) {
      await Location.stopLocationUpdatesAsync(SOS_TASK_NAME);
    }
  },

  async triggerSOS(userId, coords) {
    try {
      const response = await api.post('/sos/trigger', { userId, ...coords });
      return response.data;
    } catch (error) {
      // Implement retry queue logic here for offline support
      console.error('SOS Trigger Failed:', error);
      throw error;
    }
  }
};
