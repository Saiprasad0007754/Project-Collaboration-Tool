import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

/**
 * Centralized Axios instance.
 * `withCredentials: true` is set now so cookie-based auth (HTTP-only JWT
 * cookies) will work seamlessly once auth is implemented, without needing
 * to touch this file again.
 */
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ---------------------------------------------------------------------------
// Request interceptor
// ---------------------------------------------------------------------------
axiosInstance.interceptors.request.use(
  (config) => {
    // Placeholder for attaching an Authorization header once auth exists:
    // const token = getAccessToken();
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------------------------------------------------------
// Response interceptor — normalizes errors into a consistent shape
// ---------------------------------------------------------------------------
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const normalized = {
      statusCode: error.response?.status || 500,
      message:
        error.response?.data?.message ||
        error.message ||
        'Something went wrong. Please try again.',
      errors: error.response?.data?.errors || [],
    };

    // Placeholder for future 401 handling once auth is implemented:
    // if (normalized.statusCode === 401) { redirect to login / refresh token }

    return Promise.reject(normalized);
  }
);

export default axiosInstance;
