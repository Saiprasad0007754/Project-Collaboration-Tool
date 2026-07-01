import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { projectsApi } from '@/api/projects.api';

const PROJECTS_QUERY_KEY = 'projects';

/**
 * Fetches the authenticated user's projects.
 * @param {object} params - e.g. { page, limit, status }
 */
export const useProjects = (params = {}) => {
  return useQuery({
    queryKey: [PROJECTS_QUERY_KEY, params],
    queryFn: () => projectsApi.list(params),
  });
};

/** Fetches a single project by id. Disabled until an id is provided. */
export const useProject = (id) => {
  return useQuery({
    queryKey: [PROJECTS_QUERY_KEY, id],
    queryFn: () => projectsApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Creates a project and invalidates the project list so it refetches.
 * Success/error toasts are handled here so every call site gets
 * consistent feedback for free.
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => projectsApi.create(payload),
    onSuccess: () => {
      toast.success('Project created successfully!');
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to create project.');
    },
  });
};

/** Updates a project and invalidates the list + that project's detail query. */
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => projectsApi.update(id, payload),
    onSuccess: (_data, variables) => {
      toast.success('Project updated successfully!');
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY, variables.id] });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to update project.');
    },
  });
};

/** Deletes a project and invalidates the list. */
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => projectsApi.remove(id),
    onSuccess: () => {
      toast.success('Project deleted.');
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to delete project.');
    },
  });
};
