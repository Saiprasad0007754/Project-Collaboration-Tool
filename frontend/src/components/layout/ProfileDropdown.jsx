import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { signOut } from 'firebase/auth';
import { FiUser, FiFolder, FiSettings, FiMoon, FiSun, FiLogOut } from 'react-icons/fi';

// Adjust these imports to match where your AuthContext and Firebase auth instance live.
import useAuth from '@/hooks/useAuth';
import { auth } from '@/firebase/firebaseConfig';

const THEME_STORAGE_KEY = 'theme';

/**
 * Reads the user's current theme preference (localStorage, falling back to
 * whatever class is already on <html>, which index.css / a theme-init
 * script may have set on first load).
 */
const getInitialIsDark = () => {
  if (typeof window === 'undefined') return false;
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored) return stored === 'dark';
  return document.documentElement.classList.contains('dark');
};

/**
 * Profile avatar + dropdown menu shown in the top-right of the Navbar.
 *
 * Accessibility:
 * - Toggle button is a real <button> with aria-haspopup/aria-expanded.
 * - Menu uses role="menu" / role="menuitem" with a roving tabIndex pattern.
 * - ArrowDown/ArrowUp move focus between items, Home/End jump to first/last,
 *   Escape closes and returns focus to the trigger, Tab/outside-click closes.
 */
const ProfileDropdown = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(getInitialIsDark);

  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  const displayName = currentUser?.displayName || '';
  const email = currentUser?.email || '';
  const photoURL = currentUser?.photoURL || null;

  const avatarInitial = displayName
    ? displayName.charAt(0).toUpperCase()
    : email
      ? email.charAt(0).toUpperCase()
      : '?';

  const closeMenu = (focusTrigger = false) => {
    setIsOpen(false);
    if (focusTrigger) buttonRef.current?.focus();
  };

  // Close on outside click.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        closeMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on Escape, regardless of which element inside the menu has focus.
  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        closeMenu(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Move focus to the first menu item whenever the menu opens.
  useEffect(() => {
    if (isOpen) {
      const items = panelRef.current?.querySelectorAll('[role="menuitem"]');
      items?.[0]?.focus();
    }
  }, [isOpen]);

  // Apply the dark class to <html> and persist the preference.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  /**
   * Roving keyboard navigation within the menu panel:
   * ArrowDown/ArrowUp move focus, Home/End jump to the edges.
   */
  const handleMenuKeyDown = (event) => {
    const items = Array.from(panelRef.current?.querySelectorAll('[role="menuitem"]') || []);
    if (items.length === 0) return;

    const currentIndex = items.indexOf(document.activeElement);

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const next = items[(currentIndex + 1) % items.length];
        next.focus();
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const prev = items[(currentIndex - 1 + items.length) % items.length];
        prev.focus();
        break;
      }
      case 'Home': {
        event.preventDefault();
        items[0].focus();
        break;
      }
      case 'End': {
        event.preventDefault();
        items[items.length - 1].focus();
        break;
      }
      case 'Tab': {
        // Let Tab naturally leave the menu, but close it as it does.
        closeMenu(false);
        break;
      }
      default:
        break;
    }
  };

  const handleLogout = async () => {
    closeMenu(false);
    try {
      await signOut(auth);
      toast.success('Signed out successfully.');
      navigate('/login');
    } catch (error) {
      toast.error(error?.message || 'Failed to sign out. Please try again.');
    }
  };

  const menuItemClasses =
    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 focus:bg-slate-100 focus:outline-none dark:text-slate-200 dark:hover:bg-slate-800 dark:focus:bg-slate-800';

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Open profile menu"
        className="focus-ring h-9 w-9 overflow-hidden rounded-full ring-offset-2 ring-offset-white transition-shadow hover:ring-2 hover:ring-primary-300 dark:ring-offset-slate-900"
      >
        {photoURL ? (
          <img src={photoURL} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-primary-100 text-sm font-medium text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
            {avatarInitial}
          </span>
        )}
      </button>

      <div
        ref={panelRef}
        role="menu"
        aria-label="Profile menu"
        onKeyDown={handleMenuKeyDown}
        className={`absolute right-0 z-40 mt-2 w-64 max-w-[calc(100vw-2rem)] origin-top-right rounded-xl border border-slate-200 bg-white p-2 shadow-lg transition-all duration-150 ease-out dark:border-slate-700 dark:bg-slate-900 ${
          isOpen
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-1 scale-95 opacity-0'
        }`}
      >
        {/* User info */}
        <div className="flex items-center gap-3 px-2 py-2.5">
          {photoURL ? (
            <img
              src={photoURL}
              alt=""
              className="h-10 w-10 shrink-0 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-base font-medium text-primary-700 dark:bg-primary-900/50 dark:text-primary-300">
              {avatarInitial}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
              {displayName || 'Unnamed User'}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{email}</p>
          </div>
        </div>

        <div className="my-1.5 border-t border-slate-200 dark:border-slate-700" />

        {/* Navigation items */}
        <Link to="/profile" role="menuitem" tabIndex={-1} onClick={() => closeMenu(false)} className={menuItemClasses}>
          <FiUser size={16} />
          My Profile
        </Link>
        <Link
          to="/projects"
          role="menuitem"
          tabIndex={-1}
          onClick={() => closeMenu(false)}
          className={menuItemClasses}
        >
          <FiFolder size={16} />
          My Projects
        </Link>
        <Link
          to="/settings"
          role="menuitem"
          tabIndex={-1}
          onClick={() => closeMenu(false)}
          className={menuItemClasses}
        >
          <FiSettings size={16} />
          Settings
        </Link>
        <button
          type="button"
          role="menuitem"
          tabIndex={-1}
          onClick={() => setIsDark((prev) => !prev)}
          className={menuItemClasses}
        >
          {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
          Dark Mode
          <span className="ml-auto text-xs text-slate-400">{isDark ? 'On' : 'Off'}</span>
        </button>

        <div className="my-1.5 border-t border-slate-200 dark:border-slate-700" />

        <button
          type="button"
          role="menuitem"
          tabIndex={-1}
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 focus:bg-red-50 focus:outline-none dark:text-red-400 dark:hover:bg-red-900/20 dark:focus:bg-red-900/20"
        >
          <FiLogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
