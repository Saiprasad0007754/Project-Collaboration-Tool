import { cn } from '@/utils/cn';

const COLOR_CLASSES = {
  gray: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  green: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  yellow: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
};

/**
 * Small pill-shaped tag used for task status, priority, and labels.
 * @param {'gray'|'blue'|'green'|'yellow'|'red'|'purple'} color
 */
const Badge = ({ children, color = 'gray', className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        COLOR_CLASSES[color],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
