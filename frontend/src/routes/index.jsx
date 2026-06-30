import { createBrowserRouter } from 'react-router-dom';

import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';

import RootRedirect from '@/pages/RootRedirect';
import ProfilePage from '@/pages/ProfilePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import BoardsPage from "@/pages/BoardsPage";
import SettingsPage from "@/pages/SettingsPage";
import DashboardPage from '@/pages/DashboardPage';
import ProjectsPage from '@/pages/ProjectsPage';
import NotFoundPage from '@/pages/NotFoundPage';


export const router = createBrowserRouter([
  // --------------------------------------------------
  // Root Route
  // --------------------------------------------------
  {
    path: '/',
    element: <RootRedirect />,
  },

  // --------------------------------------------------
  // Public Routes
  // --------------------------------------------------
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmailPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },

  // --------------------------------------------------
  // Protected Routes
  // --------------------------------------------------
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/projects',
            element: <ProjectsPage />,
          },
          {
               path: '/boards',
               element: <BoardsPage />,
          },
          {
              path: '/settings',
              element: <SettingsPage />,
          },
          { path: '/profile', element: <ProfilePage /> },

        ],
      },
    ],
  },

  // --------------------------------------------------
  // 404
  // --------------------------------------------------
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);