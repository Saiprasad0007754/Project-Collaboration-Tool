import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import HomePage from '@/pages/HomePage';
import DashboardPage from '@/pages/DashboardPage';
import ProjectsPage from '@/pages/ProjectsPage';
import NotFoundPage from '@/pages/NotFoundPage';

/**
 * Central route configuration.
 * Auth-protected routes (e.g. wrapping these in a <ProtectedRoute />)
 * will be added once authentication is implemented in a later phase.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    element: <MainLayout />,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/projects', element: <ProjectsPage /> },
      // Future: /projects/:projectId, /boards/:boardId, /settings
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
