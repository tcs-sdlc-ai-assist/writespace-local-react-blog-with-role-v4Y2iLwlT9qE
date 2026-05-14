import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getSession, isAdmin } from '../utils/auth.js';

/**
 * Route guard component for protected routes.
 * Checks session via getSession(). If no session, redirects to /login.
 * If role='admin' prop is set and user is not admin, redirects to /blogs.
 * Renders children (Outlet) if authorized.
 *
 * @param {Object} props
 * @param {string} [props.role] - Required role for access ('admin' or undefined for any authenticated user).
 * @returns {JSX.Element} The rendered Outlet or a Navigate redirect.
 */
export function ProtectedRoute({ role }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin' && !isAdmin(session)) {
    return <Navigate to="/blogs" replace />;
  }

  return <Outlet />;
}

ProtectedRoute.propTypes = {
  role: PropTypes.string,
};