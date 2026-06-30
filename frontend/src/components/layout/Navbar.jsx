import { Link } from 'react-router-dom';
import { FiBell, FiMenu } from 'react-icons/fi';
import { APP_NAME } from '@/utils/constants';
import ProfileDropdown from './ProfileDropdown';

/**
 * Top navigation bar.
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
        {/* Profile avatar + dropdown menu */}
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Navbar;
