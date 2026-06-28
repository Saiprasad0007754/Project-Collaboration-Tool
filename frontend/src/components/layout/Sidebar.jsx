import { NavLink } from 'react-router-dom';
import { FiHome, FiLayout, FiFolder, FiSettings } from 'react-icons/fi';
import { cn } from '@/utils/cn';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/projects', label: 'Projects', icon: FiFolder },
  { to: '/boards', label: 'Boards', icon: FiLayout },
  { to: '/settings', label: 'Settings', icon: FiSettings },
];

/**
 * Primary sidebar navigation. Collapses off-canvas on small screens
 * and is controlled by the `isOpen` prop set from the main layout.
 */
const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 lg:hidden"
          onClick={onClose}
          role="presentation"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-20 w-64 -translate-x-full border-r border-slate-200 bg-white p-4 transition-transform duration-200 lg:static lg:translate-x-0 dark:border-slate-700 dark:bg-slate-900',
          isOpen && 'translate-x-0'
        )}
      >
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'focus-ring flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
