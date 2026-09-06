/**
 * client.js - Centralized API communication layer for TravelSphere.
 *
 * All backend requests go through this module.
 *
 * - axios instance pre-configured with base URL and default headers.
 * - Request interceptor attaches the JWT Bearer token on every request.
 * - Response interceptor handles errors globally (extended in Chunk 1).
 *
 * Do not call axios directly from pages or components.
 */

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach JWT token if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - global error handling
// Chunk 1 will extend this to redirect to /login on 401.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;