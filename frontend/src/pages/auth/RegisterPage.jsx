import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock } from 'react-icons/fi';

// Adjust this import to match where your Firebase app/auth instance is initialized.
import { auth } from '@/firebase/firebaseConfig';
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

/**
 * Maps Firebase auth error codes to user-friendly messages.
 * Falls back to the raw Firebase message for anything not mapped.
 */
const getFirebaseErrorMessage = (error) => {
  const map = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password is too weak. Please choose a stronger one.',
    'auth/network-request-failed': 'Network error. Please check your connection and try again.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  };
  return map[error?.code] || error?.message || 'Something went wrong. Please try again.';
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email.trim(),
        data.password
      );

      await updateProfile(userCredential.user, {
        displayName: data.fullName.trim(),
      });

    await sendEmailVerification(userCredential.user);

// Force the user to verify email before using the app
await auth.signOut();

toast.success(
  'Account created successfully! Please verify your email before logging in.'
);

navigate('/verify-email');
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
                Create your account
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                Start collaborating with your team in minutes.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Full Name
                </label>
                <div className="relative">
                  <FiUser
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Jane Doe"
                    aria-invalid={!!errors.fullName}
                    className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                      errors.fullName
                        ? 'border-red-400 focus:ring-red-300'
                        : 'border-slate-300 focus:ring-indigo-400 dark:border-slate-700'
                    }`}
                    {...register('fullName', {
                      required: 'Full name is required.',
                      minLength: { value: 2, message: 'Name must be at least 2 characters.' },
                      maxLength: { value: 60, message: 'Name must be under 60 characters.' },
                    })}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.fullName.message}</p>
                )}
              </div>

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

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Password
                </label>
                <div className="relative">
                  <FiLock
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    aria-invalid={!!errors.password}
                    className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                      errors.password
                        ? 'border-red-400 focus:ring-red-300'
                        : 'border-slate-300 focus:ring-indigo-400 dark:border-slate-700'
                    }`}
                    {...register('password', {
                      required: 'Password is required.',
                      pattern: {
                        value: PASSWORD_REGEX,
                        message:
                          'Password must be 8+ characters and include uppercase, lowercase, a number, and a special character.',
                      },
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none dark:hover:text-slate-300"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {errors.password ? (
                  <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>
                ) : (
                  <p className="mt-1.5 text-xs text-slate-400">
                    Use 8+ characters with uppercase, lowercase, a number, and a symbol.
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    aria-invalid={!!errors.confirmPassword}
                    className={`w-full rounded-lg border bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 ${
                      errors.confirmPassword
                        ? 'border-red-400 focus:ring-red-300'
                        : 'border-slate-300 focus:ring-indigo-400 dark:border-slate-700'
                    }`}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password.',
                      validate: (value) =>
                        value === passwordValue || 'Passwords do not match.',
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none dark:hover:text-slate-300"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.confirmPassword.message}</p>
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
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
