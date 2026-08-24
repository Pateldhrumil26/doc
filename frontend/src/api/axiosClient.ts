import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token or guest ID
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('docpad_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Guest identifier
    let guestId = localStorage.getItem('docpad_guest_id');
    if (!guestId) {
      guestId = '000000000000000000000001';
      localStorage.setItem('docpad_guest_id', guestId);
    }
    if (config.headers) {
      config.headers['x-guest-id'] = guestId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
