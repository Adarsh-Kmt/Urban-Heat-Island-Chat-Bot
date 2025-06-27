import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || 'Server error occurred';
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Unable to connect to server. Please check your internet connection.');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred');
    }
  }
);

export const sendMessage = async (message, conversationHistory = []) => {
  try {
    const response = await api.post('/chat/message', {
      message,
      conversationHistory: conversationHistory.slice(-10) // Send last 5 exchanges
    });
    
    return response.data;
  } catch (error) {
    console.error('Send message error:', error);
    throw error;
  }
};

export const analyzeLocation = async (locationName) => {
  try {
    const response = await api.post('/chat/analyze-location', {
      locationName
    });
    
    return response.data;
  } catch (error) {
    console.error('Analyze location error:', error);
    throw error;
  }
};

export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};

export default api;
