import { Link } from 'react-router-dom';
import { getSession, isAdmin } from '../utils/auth.js';

/**
 * Footer component with WriteSpace branding, navigation links, and copyright notice.
 * Shows Home, Login, Register links for unauthenticated users.
 * Shows Home, Blogs, and optionally Dashboard links for authenticated users.
 * Used on the landing page and optionally on other pages.
 *
 * @returns {JSX.Element} The rendered footer element.
 */
export function Footer() {
  const session = getSession();
  const userIsAdmin = session ? isAdmin(session) : false;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-primary-700 font-bold text-lg tracking-tight hover:text-primary-800 transition-colors"
          >
            <span role="img" aria-label="WriteSpace logo">✍️</span>
            <span className="font-sans">WriteSpace</span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-6" aria-label="Footer navigation">
            <Link
              to="/"
              className="text-neutral-600 hover:text-primary-600 text-sm font-medium transition-colors"
            >
              Home
            </Link>
            {session ? (
              <>
                <Link
                  to="/blogs"
                  className="text-neutral-600 hover:text-primary-600 text-sm font-medium transition-colors"
                >
                  Blogs
                </Link>
                {userIsAdmin && (
                  <Link
                    to="/admin"
                    className="text-neutral-600 hover:text-primary-600 text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-neutral-600 hover:text-primary-600 text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-neutral-600 hover:text-primary-600 text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Copyright */}
          <p className="text-neutral-500 text-sm">
            © {currentYear} WriteSpace. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}