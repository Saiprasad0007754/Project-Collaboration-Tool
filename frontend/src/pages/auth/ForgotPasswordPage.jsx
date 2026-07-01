import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { sendPasswordResetEmail } from 'firebase/auth';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

// Adjust this import to match where your Firebase app/auth instance is initialized.
import { auth } from '@/firebase/firebaseConfig'; 
/**
 * Maps Firebase auth error codes to user-friendly messages.
 * Falls back to the raw Firebase message for anything not mapped.
 */
const getFirebaseErrorMessage = (error) => {
  const map = {
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/network-request-failed': 'Network error. Please check your connection and try again.',
  };
  return map[error?.code] || error?.message || 'Something went wrong. Please try again.';
};

const ForgotPasswordPage = () => {
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await sendPasswordResetEmail(auth, data.email.trim());
      toast.success('Password reset email sent! Please check your inbox.');
      setEmailSent(true);
    } catch (error) {
      toast.error(getFirebaseErrorMessage(error));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
          {/* Accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600" />

          <div className="p-6 sm:p-8">
            <div className="mb-7 text-center">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Reset your password
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                Enter your email and we&apos;ll send you a link to reset your password.
              </p>
            </div>

            {emailSent ? (
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <FiMail size={26} />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  We&apos;ve sent a password reset link to{' '}
                  <span className="font-medium text-slate-800 dark:text-slate-100">
                    {getValues('email')}
                  </span>
                  . Follow the instructions in the email to choose a new password.
                </p>
                <button
                  type="button"
                  onClick={() => setEmailSent(false)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <FiMail
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      aria-invalid={!!errors.email}
                      className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                        errors.email
                          ? 'border-red-400 focus:ring-red-300'
                          : 'border-slate-300 focus:ring-indigo-400 dark:border-slate-700'
                      }`}
                      {...register('email', {
                        required: 'Email is required.',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Please enter a valid email address.',
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-300"
                >
                  {isSubmitting && (
                    <span
                      className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                      aria-hidden="true"
                    />
                  )}
                  {isSubmitting ? 'Sending...' : 'Send reset link'}
                </button>
              </form>
            )}

            <Link
              to="/login"
              className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              <FiArrowLeft size={14} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
