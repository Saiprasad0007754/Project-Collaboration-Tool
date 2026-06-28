import clsx from 'clsx';

/**
 * Thin wrapper around clsx for composing conditional Tailwind class names
 * in reusable components.
 * Usage: cn('px-4 py-2', isActive && 'bg-primary-500', className)
 */
export const cn = (...inputs) => clsx(...inputs);
