import { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

/**
 * Reusable text input designed to integrate cleanly with react-hook-form
 * via `register('fieldName')` spread onto props (id/name/onChange/onBlur/ref).
 *
 * @param {string} label
 * @param {string} error - Validation error message to display.
 * @param {string} helperText - Non-error helper text shown when there's no error.
 */
const Input = forwardRef(
  ({ label, error, helperText, className, type = 'text', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-200">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            'focus-ring w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 dark:bg-slate-900 dark:text-slate-100',
            error ? 'border-red-400' : 'border-slate-300 dark:border-slate-700',
            className
          )}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-red-500">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
