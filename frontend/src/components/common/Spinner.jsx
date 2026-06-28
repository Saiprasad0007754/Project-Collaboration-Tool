import { cn } from '@/utils/cn';

const SIZE_CLASSES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-3',
  lg: 'h-12 w-12 border-4',
};

/**
 * Generic loading spinner. Use `fullScreen` for route-level/page loaders.
 */
const Spinner = ({ size = 'md', fullScreen = false, className }) => {
  const spinner = (
    <span
      className={cn(
        'inline-block animate-spin rounded-full border-primary-500 border-t-transparent',
        SIZE_CLASSES[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );

  if (fullScreen) {
    return <div className="flex h-screen w-full items-center justify-center">{spinner}</div>;
  }

  return spinner;
};

export default Spinner;
