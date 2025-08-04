import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for session authentication
});

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