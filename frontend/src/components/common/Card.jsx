import { cn } from '@/utils/cn';

/**
 * Generic surface container used throughout the app (task cards, panels,
 * dashboard widgets). Keep it free of business logic so it stays reusable.
 */
const Card = ({ children, className, as: Component = 'div', ...props }) => {
  return (
    <Component
      className={cn(
        'rounded-xl border border-slate-200 bg-white p-4 shadow-card dark:border-slate-700 dark:bg-slate-900',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;
