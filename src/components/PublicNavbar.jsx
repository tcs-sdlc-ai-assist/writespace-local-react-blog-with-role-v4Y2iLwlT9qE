import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getSession, isAdmin } from '../utils/auth.js';

/**
 * Public navigation bar for unauthenticated users.
 * Displays WriteSpace logo/brand, and links to Home (/), Login (/login), and Register (/register).
 * Responsive with mobile hamburger menu.
 * Checks session to conditionally show Dashboard or Blogs link if user is already logged in.
 *
 * @returns {JSX.Element} The rendered public navigation bar.
 */
export function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const session = getSession();
  const userIsAdmin = session ? isAdmin(session) : false;

  function toggleMenu() {
    setMenuOpen((prev) => !prev);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="bg-white shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-primary-700 font-bold text-xl tracking-tight hover:text-primary-800 transition-colors"
            onClick={closeMenu}
          >
            <span role="img" aria-label="WriteSpace logo">✍️</span>
            <span className="font-sans">WriteSpace</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
            >
              Home
            </Link>
            {session ? (
              userIsAdmin ? (
                <Link
                  to="/admin"
                  className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/blogs"
                  className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Blogs
                </Link>
              )
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-neutral-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors shadow-soft"
                >
                  Register
                </Link>
              </>
            )}
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
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 font-medium transition-colors"
              onClick={closeMenu}
            >
              Home
            </Link>
            {session ? (
              userIsAdmin ? (
                <Link
                  to="/admin"
                  className="block px-3 py-2 rounded-md text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 font-medium transition-colors"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/blogs"
                  className="block px-3 py-2 rounded-md text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 font-medium transition-colors"
                  onClick={closeMenu}
                >
                  Blogs
                </Link>
              )
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-neutral-700 hover:text-primary-600 hover:bg-neutral-50 font-medium transition-colors"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md text-white bg-primary-600 hover:bg-primary-700 font-medium transition-colors text-center"
                  onClick={closeMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}