import { API_URL, DEMO_MODE } from '../api/config';
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SOCKET_URL = API_URL;

class VirtualSocket {
  connected = false;
  listeners = {};

  connect() {
    this.connected = true;
    console.log('[VirtualSocket] Connected to mock WebSocket');
    setTimeout(() => {
      this.trigger('connect');
    }, 100);
  }

  disconnect() {
    this.connected = false;
    console.log('[VirtualSocket] Disconnected from mock WebSocket');
    this.trigger('disconnect');
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    console.log(`[VirtualSocket] Emit: ${event}`, data);
    
    if (event === 'join_room') {
      const { userId, role } = data;
      console.log(`[VirtualSocket] User ${userId} joined room as ${role}`);
      if (role === 'MECHANIC') {
        // Trigger a new SOS request on mechanic dashboard after 4 seconds
        setTimeout(() => {
          this.trigger('new_sos_request', {
            id: 'mock-sos-request-id-789',
            userId: 'demo-user-id-traveler',
            lat: 18.5204,
            lng: 73.8567,
            createdAt: new Date().toISOString(),
            images: [
              'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=200'
            ]
          });
        }, 4000);
      }
    }

    if (event === 'respond_sos') {
      const { requestId, mechanicId, status } = data;
      console.log(`[VirtualSocket] Mechanic ${mechanicId} responded ${status} to request ${requestId}`);
      if (status === 'ACCEPTED') {
        setTimeout(() => {
          const responseData = {
            status: 'ACCEPTED',
            requestId: requestId,
            mechanicId: mechanicId,
          };
          this.trigger(`sos_response_demo-user-id-driver`, responseData);
          this.trigger(`sos_response_demo-user-id-traveler`, responseData);
        }, 1000);
      }
    }
  }

  emitWithAck(event, data) {
    console.log(`[VirtualSocket] EmitWithAck: ${event}`, data);
    return new Promise((resolve) => {
      if (event === 'trigger_sos') {
        setTimeout(() => {
          resolve({
            status: 'SUCCESS',
            internalMechanics: [
              { id: 'm1', name: 'Ramesh Sharma (Verified)', distance: '1.2 km', lat: 18.5204 + 0.005, lng: 73.8567 + 0.003, rating: 4.8, open: true },
              { id: 'm2', name: 'Suresh Patel (Verified)', distance: '2.5 km', lat: 18.5204 - 0.004, lng: 73.8567 - 0.006, rating: 4.5, open: true }
            ],
            nearbyGarages: [
              { id: 'g1', name: 'Pune Auto Services', distance: '3.1 km', lat: 18.5204 + 0.010, lng: 73.8567 - 0.008, rating: 4.2, open: true },
              { id: 'g2', name: 'Highway Garage', distance: '4.8 km', lat: 18.5204 - 0.012, lng: 73.8567 + 0.010, rating: 3.9, open: false }
            ]
          });

          // Simulate auto accept by a mechanic after 4 seconds for the traveler's screen
          setTimeout(() => {
            console.log('[VirtualSocket] Dispatching sos_response acceptance event');
            const responseData = {
              status: 'ACCEPTED',
              requestId: 'mock-sos-request-id-789',
              mechanicId: 'm1'
            };
            this.trigger(`sos_response_demo-user-id-driver`, responseData);
            this.trigger(`sos_response_demo-user-id-traveler`, responseData);
          }, 4000);

        }, 1500);
      } else {
        resolve({ status: 'SUCCESS' });
      }
    });
  }

  trigger(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in virtual socket listener for ${event}:`, e);
        }
      });
    }
  }
}

class SocketService {
  socket = null;

  connect() {
    if (DEMO_MODE) {
      this.socket = new VirtualSocket();
      this.socket.connect();
      return;
    }

    try {
      this.socket = io(SOCKET_URL);
      
      this.socket.on('connect', async () => {
        console.log('Connected to SOS WebSocket');
        try {
          const queued = await AsyncStorage.getItem('queued_sos');
          if (queued) {
            console.log('Recovering queued SOS...');
            this.emit('trigger_sos', JSON.parse(queued));
            await AsyncStorage.removeItem('queued_sos');
          }
        } catch (e) {
          console.error('Failed to recover SOS', e);
        }
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from SOS WebSocket');
      });
    } catch (e) {
      console.warn('Real Socket connection failed, using VirtualSocket fallback', e.message);
      this.socket = new VirtualSocket();
      this.socket.connect();
    }
  }

  emit(event, data) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  emitWithAck(event, data) {
    if (this.socket && typeof this.socket.emitWithAck === 'function') {
      return this.socket.emitWithAck(event, data);
    }
    return new Promise((resolve) => {
      if (this.socket) {
        this.socket.emit(event, data, resolve);
      } else {
        resolve(null);
      }
    });
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketService();
