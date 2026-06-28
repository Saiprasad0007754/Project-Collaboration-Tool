import { Link } from 'react-router-dom';
import { FiBell, FiMenu } from 'react-icons/fi';
import { APP_NAME } from '@/utils/constants';

/**
 * Top navigation bar. The user menu / avatar is a placeholder until
 * authentication is implemented.
 */
const Navbar = ({ onToggleSidebar }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="focus-ring rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
          aria-label="Toggle sidebar"
        >
          <FiMenu size={20} />
        </button>
        <Link to="/" className="text-lg font-semibold text-primary-600 dark:text-primary-400">
          {APP_NAME}
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="focus-ring relative rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Notifications"
        >
          <FiBell size={20} />
        </button>
        {/* Placeholder avatar — replace with real user data once auth exists */}
        <div className="h-9 w-9 rounded-full bg-primary-100 text-center text-sm font-medium leading-9 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
          U
        </div>
      </div>
    </header>
  );
};

export default Navbar;
