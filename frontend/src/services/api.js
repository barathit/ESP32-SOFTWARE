import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
};

// Rescue Operation API
export const rescueAPI = {
  startOperation: async (data) => {
    const response = await api.post('/rescue/pre-rescue', data);
    return response.data;
  },
  endOperation: async (data) => {
    const response = await api.post('/rescue/post-rescue', data);
    return response.data;
  },
  uploadOperation: async (operationId) => {
    const response = await api.post(`/rescue/upload-operation/${operationId}`);
    return response.data;
  },
  getActiveOperations: async () => {
    const response = await api.get('/rescue/active');
    return response.data;
  },
  getOperation: async (operationId) => {
    const response = await api.get(`/rescue/${operationId}`);
    return response.data;
  },
};

// Telemetry API
export const telemetryAPI = {
  getTelemetry: async (operationId, fighterId) => {
    const params = { operationId };
    if (fighterId) params.fighterId = fighterId;
    const response = await api.get('/admin/telemetry/' + operationId, { params });
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  registerCommando: async (data) => {
    const response = await api.post('/admin/commando', data);
    return response.data;
  },
  updateCommando: async (id, data) => {
    const response = await api.put(`/admin/commando/${id}`, data);
    return response.data;
  },
  deleteCommando: async (id) => {
    const response = await api.delete(`/admin/commando/${id}`);
    return response.data;
  },
  getCommandos: async () => {
    const response = await api.get('/admin/commandos');
    return response.data;
  },
  mapDevice: async (fighterId, deviceId) => {
    const response = await api.post('/admin/map-device', { fighterId, deviceId });
    return response.data;
  },
  search: async (params) => {
    const response = await api.get('/admin/search', { params });
    return response.data;
  },
  getSummary: async (startDate, endDate) => {
    const params = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await api.get('/admin/summary', { params });
    return response.data;
  },
  getTelemetryHistory: async (operationId, fighterId, limit) => {
    const params = { limit };
    if (fighterId) params.fighterId = fighterId;
    const response = await api.get(`/admin/telemetry/${operationId}`, { params });
    return response.data;
  },
  getOperations: async (status, limit) => {
    const params = {};
    if (status) params.status = status;
    if (limit) params.limit = limit;
    const response = await api.get('/admin/operations', { params });
    return response.data;
  },
};

export default api;

