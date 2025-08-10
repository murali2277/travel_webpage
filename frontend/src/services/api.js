import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for session authentication
});

// Function to get CSRF token
const getCSRFToken = () => {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

// Request interceptor to add CSRF token
api.interceptors.request.use(
  (config) => {
    const csrfToken = getCSRFToken();
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle CSRF errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 403 && error.response?.data?.detail === 'CSRF Failed') {
      // Try to get a new CSRF token and retry the request
      console.log('CSRF token expired, retrying request...');
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const searchVehicles = async (searchData) => {
  try {
    const response = await api.post('/search/', searchData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/book/', bookingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createDirectBooking = async (bookingData) => {
  try {
    const response = await api.post('/direct-book/', bookingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const submitContact = async (contactData) => {
  try {
    const response = await api.post('/contact/', contactData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getBookingDetails = async (bookingId) => {
  try {
    const response = await api.get(`/booking/${bookingId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Authentication endpoints
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/register/', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/login/', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post('/logout/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/profile/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/profile/', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default api;
