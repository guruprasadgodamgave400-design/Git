import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: true,

  setAuth: async (user, token) => {
    await SecureStore.setItemAsync('access_token', token);
    await SecureStore.setItemAsync('user_data', JSON.stringify(user));
    set({ user, token, isLoading: false });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('access_token');
    await SecureStore.deleteItemAsync('user_data');
    set({ user: null, token: null, isLoading: false });
  },

  loadAuth: async () => {
    const token = await SecureStore.getItemAsync('access_token');
    const userData = await SecureStore.getItemAsync('user_data');
    if (token && userData) {
      set({ user: JSON.parse(userData), token, isLoading: false });
    } else {
      set({ isLoading: false });
    }
  },
}));
