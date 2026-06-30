import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const RootRedirect = () => {
  const { currentUser, loading } = useAuth();

  // Show loading while Firebase checks auth state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  // User not logged in
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // User logged in but email not verified
  if (!currentUser.emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // User logged in and verified
  return <Navigate to="/dashboard" replace />;
};

export default RootRedirect;