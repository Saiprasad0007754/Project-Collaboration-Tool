import { apiClient } from './index';

/**
 * Thin wrappers around the five Project CRUD endpoints.
 * Each one returns the already-unwrapped `data` field from the backend's
 * ApiResponse envelope (the axios response interceptor handles that).
 */
export const projectsApi = {
  /** GET /api/projects?page=&limit=&status= */
  list: (params = {}) => apiClient.get('/projects', { params }),

  /** GET /api/projects/:id */
  getById: (id) => apiClient.get(`/projects/${id}`),

  /** POST /api/projects */
  create: (payload) => apiClient.post('/projects', payload),

  /** PUT /api/projects/:id */
  update: (id, payload) => apiClient.put(`/projects/${id}`, payload),

  /** DELETE /api/projects/:id */
  remove: (id) => apiClient.delete(`/projects/${id}`),
};
