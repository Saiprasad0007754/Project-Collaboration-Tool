import axiosInstance from './axiosInstance';

/**
 * Thin generic wrappers around the axios instance.
 * Resource-specific API modules (projects.api.js, tasks.api.js, etc.)
 * should be added here in upcoming phases and built on top of these.
 */
export const apiClient = {
  get: (url, config = {}) => axiosInstance.get(url, config),
  post: (url, data = {}, config = {}) => axiosInstance.post(url, data, config),
  put: (url, data = {}, config = {}) => axiosInstance.put(url, data, config),
  patch: (url, data = {}, config = {}) => axiosInstance.patch(url, data, config),
  delete: (url, config = {}) => axiosInstance.delete(url, config),
};

/**
 * Example health check call — useful for verifying the frontend/backend
 * connection during setup.
 */
export const checkHealth = () => apiClient.get('/health');
