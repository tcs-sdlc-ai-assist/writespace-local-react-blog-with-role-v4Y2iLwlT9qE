import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, isAdmin, logout } from '../utils/auth.js';
import { Avatar } from './Avatar.jsx';

/**
 * Authenticated navigation bar for WriteSpace.
 * Displays WriteSpace brand, links to Blogs (/blogs), Write (/write),
 * and conditionally Admin Dashboard (/admin) and Users (/users) for admin role.
 * Shows user avatar, display name, and logout button.
 * Responsive with mobile hamburger menu.
 *
 * @returns {JSX.Element} The rendered authenticated navigation bar.
 */
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const session = getSession();
  const userIsAdmin = session ? isAdmin(session) : false;

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenu();
    navigate('/login');
  }

  return (
    <nav className="bg-white shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <Link
            to="/blogs"
            className="flex items-center space-x-2 text-primary-700 font-bold text-xl tracking-tight hover:text-primary-800 transition-colors"
            onClick={closeMenu}
          >
            <span role="img" aria-label="WriteSpace logo">✍️</span>
            <span className="font-sans">WriteSpace</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/blogs"
              className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
            >
              Blogs
            </Link>
            <Link
              to="/write"
              className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
            >
              Write
            </Link>
            {userIsAdmin && (
              <>
                <Link
                  to="/admin"
                  className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/users"
                  className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Users
                </Link>
              </>
            )}

            {/* User Info & Logout */}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-neutral-200">
              <Avatar role={session ? session.role : 'user'} size="sm" />
              <span className="text-neutral-700 font-medium text-sm">
                {session ? session.displayName : ''}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-danger-700 bg-danger-50 hover:bg-danger-100 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            {/* User Info */}
            <div className="flex items-center space-x-3 px-3 py-2 border-b border-neutral-100 mb-2">
              <Avatar role={session ? session.role : 'user'} size="sm" />
              <span className="text-neutral-700 font-medium text-sm">
                {session ? session.displayName : ''}
              </span>
            </div>

            <Link
              to="/blogs"
              className="block px-3 py-2 rounded-md text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 font-medium transition-colors"
              onClick={closeMenu}
            >
              Blogs
            </Link>
            <Link
              to="/write"
              className="block px-3 py-2 rounded-md text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 font-medium transition-colors"
              onClick={closeMenu}
            >
              Write
            </Link>
            {userIsAdmin && (
              <>
                <Link
                  to="/admin"
                  className="block px-3 py-2 rounded-md text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 font-medium transition-colors"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <Link
                  to="/users"
                  className="block px-3 py-2 rounded-md text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 font-medium transition-colors"
                  onClick={closeMenu}
                >
                  Users
                </Link>
              </>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-md text-danger-700 bg-danger-50 hover:bg-danger-100 font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}