import AsyncStorage from '@react-native-async-storage/async-storage';

export const clearAuth = async () => {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  } catch (e) {
    console.log('Logout error:', e);
  }
};
