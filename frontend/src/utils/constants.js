export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Project Collab Tool';

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROJECTS: '/projects',
  PROJECT_DETAILS: '/projects/:projectId',
  BOARD: '/boards/:boardId',
  NOT_FOUND: '*',
};

// Trello-style task status columns — placeholder until Board model exists
export const TASK_STATUSES = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW: 'in_review',
  DONE: 'done',
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUSES.TODO]: 'To Do',
  [TASK_STATUSES.IN_PROGRESS]: 'In Progress',
  [TASK_STATUSES.IN_REVIEW]: 'In Review',
  [TASK_STATUSES.DONE]: 'Done',
};

export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};
