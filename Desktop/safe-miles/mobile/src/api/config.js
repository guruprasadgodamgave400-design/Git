import axios from 'axios';

export const API_URL = 'http://10.58.221.196:3001';
export const DEMO_MODE = true;

// Keep local state for mock KYC status to make the verification flow interactive!
let mockKycStatus = 'APPROVED';

const getMockResponse = (config) => {
  const { url, method, data } = config;
  const normalizedUrl = url.replace(API_URL, '').split('?')[0];
  const reqData = data ? (typeof data === 'string' ? JSON.parse(data) : data) : {};

  if (normalizedUrl === '/auth/otp' && method === 'post') {
    const role = reqData.role || 'DRIVER';
    const phone = reqData.phone || '9876543210';
    let name = 'Demo User';
    if (phone === '9876543210') name = 'Demo Driver';
    else if (phone === '9876543211') name = 'Demo Mechanic';
    else if (phone === '9876543212') name = 'Demo Fleet Manager';
    else name = `Demo ${role.charAt(0) + role.slice(1).toLowerCase()}`;

    // Reset kycStatus on login based on role
    mockKycStatus = 'APPROVED'; 

    return {
      status: 200,
      data: {
        access_token: 'mock-jwt-token-123456',
        user: {
          id: 'demo-user-id-' + role.toLowerCase(),
          name,
          phone,
          email: `${role.toLowerCase()}@saarthimitra.com`,
          role,
          kycStatus: mockKycStatus,
        }
      }
    };
  }

  if (normalizedUrl === '/auth/signup' && method === 'post') {
    const role = reqData.role || 'TRAVELER';
    const name = reqData.name || 'Demo User';
    const phone = reqData.phone || '9876543210';
    mockKycStatus = (role === 'TRAVELER') ? 'APPROVED' : 'PENDING'; // Start as pending for new signup to show verification upload

    return {
      status: 201,
      data: {
        access_token: 'mock-jwt-token-123456',
        user: {
          id: 'demo-user-id-' + role.toLowerCase(),
          name,
          phone,
          email: reqData.email || `${role.toLowerCase()}@saarthimitra.com`,
          role,
          kycStatus: mockKycStatus,
        }
      }
    };
  }

  if (normalizedUrl === '/verification/status' && method === 'get') {
    return {
      status: 200,
      data: {
        kycStatus: mockKycStatus
      }
    };
  }

  if ((normalizedUrl === '/verification/driver' || normalizedUrl === '/verification/mechanic') && method === 'post') {
    mockKycStatus = 'APPROVED'; // Mark as approved after they submit the documents
    return {
      status: 200,
      data: {
        status: 'SUCCESS',
        message: 'Documents submitted successfully and approved in Demo Mode.'
      }
    };
  }

  if (normalizedUrl === '/notifications' && method === 'get') {
    return {
      status: 200,
      data: [
        {
          id: 'n1',
          title: 'Emergency Service Dispatched',
          message: 'Mechanic Ramesh Sharma is heading to your location.',
          type: 'SOS_ASSIGNED',
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'n2',
          title: 'Welcome to SaarthiMitra',
          message: 'Your account has been fully verified and activated. Drive safely!',
          type: 'WELCOME',
          isRead: true,
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: 'n3',
          title: 'SOS Request Created',
          message: 'An emergency broadcast was sent out successfully.',
          type: 'SOS_CREATED',
          isRead: false,
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        }
      ]
    };
  }

  if (normalizedUrl.startsWith('/notifications/') && normalizedUrl.endsWith('/read') && method === 'patch') {
    return {
      status: 200,
      data: { success: true }
    };
  }

  if (normalizedUrl === '/upload/damage' && method === 'post') {
    return {
      status: 200,
      data: {
        urls: [
          'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=400'
        ]
      }
    };
  }

  return null;
};

export const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});

// Setup custom adapter for mock/fallback
const defaultAdapter = api.defaults.adapter || axios.defaults.adapter;

api.defaults.adapter = async (config) => {
  if (DEMO_MODE) {
    const mockRes = getMockResponse(config);
    if (mockRes) {
      console.log(`[DEMO_MODE] Mocking ${config.method.toUpperCase()} ${config.url}`);
      return Promise.resolve({
        data: mockRes.data,
        status: mockRes.status,
        statusText: mockRes.status === 200 || mockRes.status === 201 ? 'OK' : 'Created',
        headers: {},
        config,
      });
    }
  }

  try {
    return await defaultAdapter(config);
  } catch (error) {
    // If connection/network fails, fallback to mock data
    const isNetworkError = !error.response || error.code === 'ECONNREFUSED' || error.message.includes('Network Error') || error.message.includes('timeout');
    if (isNetworkError) {
      const mockRes = getMockResponse(config);
      if (mockRes) {
        console.warn(`[OFFLINE FALLBACK] Server unreachable (${error.message}). Mocking ${config.method.toUpperCase()} ${config.url}`);
        return Promise.resolve({
          data: mockRes.data,
          status: mockRes.status,
          statusText: 'OK',
          headers: {},
          config,
        });
      }
    }
    throw error;
  }
};

api.interceptors.response.use(
  (res) => res,
  (error) => {
    console.log("Handled API error:", error.response?.status || error.message);
    return Promise.reject(error);
  }
);

export const safeRequest = async (requestPromise, fallbackData = null) => {
  try {
    const response = await requestPromise;
    return response.data;
  } catch (error) {
    console.log('API Request failed, using fallback data. Error:', error.message);
    return fallbackData;
  }
};