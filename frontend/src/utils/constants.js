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

// -----------------------------------------------------------------------------
// Project Statuses
// -----------------------------------------------------------------------------

export const PROJECT_STATUSES = {
  PLANNING: 'planning',
  ACTIVE: 'active',
  ON_HOLD: 'on_hold',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const PROJECT_STATUS_LABELS = {
  [PROJECT_STATUSES.PLANNING]: 'Planning',
  [PROJECT_STATUSES.ACTIVE]: 'Active',
  [PROJECT_STATUSES.ON_HOLD]: 'On Hold',
  [PROJECT_STATUSES.COMPLETED]: 'Completed',
  [PROJECT_STATUSES.CANCELLED]: 'Cancelled',
};

export const PROJECT_STATUS_COLORS = {
  [PROJECT_STATUSES.PLANNING]: 'gray',
  [PROJECT_STATUSES.ACTIVE]: 'green',
  [PROJECT_STATUSES.ON_HOLD]: 'yellow',
  [PROJECT_STATUSES.COMPLETED]: 'blue',
  [PROJECT_STATUSES.CANCELLED]: 'red',
};
