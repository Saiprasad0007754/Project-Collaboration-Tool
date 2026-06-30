import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '@/hooks/useAuth';
/**
 * Route guard for authenticated areas of the app.
 *
 * Behavior:
 * - While auth state is still resolving, shows a full-screen spinner
 *   instead of flashing a redirect.
 * - Unauthenticated users are redirected to /login (their intended
 *   destination is preserved in location state for a post-login redirect).
 * - Authenticated users with an unverified email are redirected to
 *   /verify-email.
 * - Otherwise, renders the nested route via <Outlet />.
 *
 * Usage (in your router config):
 *   {
 *     element: <ProtectedRoute />,
 *     children: [
 *       { path: '/dashboard', element: <DashboardPage /> },
 *       ...
 *     ],
 *   }
 *
 * Can also be used as a wrapper around explicit children:
 *   <ProtectedRoute><DashboardPage /></ProtectedRoute>
 */
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <span
          className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!currentUser.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children ?? <Outlet />;
};

export default ProtectedRoute;
