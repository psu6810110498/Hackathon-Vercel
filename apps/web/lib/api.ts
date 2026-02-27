import axios from 'axios';
import { useAuthStore } from '../store/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for cross-site cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for CSRF / Auth tokens if we needed to inject them manually
api.interceptors.request.use((config) => {
  // Can inject CSRF double-submit token here
  // const csrfToken = getCookie('csrf_token');
  // if (csrfToken) config.headers['x-csrf-token'] = csrfToken;
  return config;
});

// Interceptor for Error Normalization and Auto-Logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized - Auto Logout
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }

    // 403 Forbidden - Org/Role access denied
    if (error.response?.status === 403) {
      console.warn('Access Denied (403):', error.response.data);
      // Could trigger a toast here
    }

    // 429 Too Many Requests - Could implement backoff/retry here
    if (error.response?.status === 429) {
      console.warn('Rate Limited (429):', error.response.data);
      // Could trigger a toast here
    }

    return Promise.reject(error);
  }
);
