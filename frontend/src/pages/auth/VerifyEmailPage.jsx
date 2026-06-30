import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { sendEmailVerification, signOut, onAuthStateChanged } from 'firebase/auth';
import { FiMail, FiRefreshCw, FiLogOut } from 'react-icons/fi';

// Adjust this import to match where your Firebase app/auth instance is initialized.
import { auth } from '@/firebase/firebase';
const RESEND_COOLDOWN_SECONDS = 60;

/**
 * Maps Firebase auth error codes to user-friendly messages.
 * Falls back to the raw Firebase message for anything not mapped.
 */
const getFirebaseErrorMessage = (error) => {
  const map = {
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/network-request-failed': 'Network error. Please check your connection and try again.',
    'auth/user-token-expired': 'Your session has expired. Please log in again.',
  };
  return map[error?.code] || error?.message || 'Something went wrong. Please try again.';
};

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(auth.currentUser);
  const [isResending, setIsResending] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Keep the displayed user/email in sync with the actual auth state.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  // Countdown ticker for the resend cooldown.
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const checkVerification = async () => {
  if (!auth.currentUser) return;

  await auth.currentUser.reload();

  if (auth.currentUser.emailVerified) {
    toast.success("Email verified successfully!");

    navigate("/dashboard", { replace: true });
  } else {
    toast("Email is not verified yet.");
  }
};

  const handleResendEmail = async () => {
    if (!auth.currentUser) {
      toast.error('No active session found. Please log in again.');
      navigate('/login');
      return;
    }

    setIsResending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success('Verification email sent! Please check your inbox.');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      toast.error(getFirebaseErrorMessage(error));
    } finally {
      setIsResending(false);
    }
  };

  const handleGoToLogin = async () => {
    setIsSigningOut(true);
    try {
      await signOut(auth);
    } catch {
      // Even if sign-out fails, still send the user to the login page.
    } finally {
      setIsSigningOut(false);
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          {/* Accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600" />

          <div className="p-6 text-center sm:p-8">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
              <FiMail size={26} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Verify your email
            </h1>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              We&apos;ve sent a verification link to{' '}
              {user?.email ? (
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {user.email}
                </span>
              ) : (
                'your email address'
              )}
              . Please click the link to activate your account, then return here.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleResendEmail}
                disabled={isResending || cooldown > 0}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-300"
              >
                {isResending ? (
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                    aria-hidden="true"
                  />
                ) : (
                  <FiRefreshCw size={16} />
                )}
                {isResending
                  ? 'Sending...'
                  : cooldown > 0
                    ? `Resend available in ${cooldown}s`
                    : 'Resend verification email'}
              </button>
              <button
                type="button"
                 onClick={checkVerification}
                 className="flex w-full items-center justify-center rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                >
                 I've Verified My Email
                </button>

              <button
                type="button"
                onClick={handleGoToLogin}
                disabled={isSigningOut}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {isSigningOut ? (
                  <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent"
                    aria-hidden="true"
                  />
                ) : (
                  <FiLogOut size={16} />
                )}
                Go to Login
              </button>
            </div>

            <p className="mt-6 text-xs text-slate-400 dark:text-slate-500">
              Didn&apos;t get the email? Check your spam folder, or make sure the address above is
              correct.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
