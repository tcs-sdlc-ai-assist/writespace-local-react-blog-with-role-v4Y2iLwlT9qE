import PropTypes from 'prop-types';
import { Avatar } from './Avatar.jsx';

/**
 * Format an ISO date string to a human-readable format.
 * @param {string} dateStr - ISO date string.
 * @returns {string} Formatted date string.
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * UserRow component for admin user management.
 * Displays avatar, display name, username, role badge, creation date, and delete button.
 * Delete button is disabled for the hard-coded admin user and for the current user (self).
 *
 * @param {Object} props
 * @param {Object} props.user - The user object.
 * @param {string} props.user.id - User ID.
 * @param {string} props.user.displayName - User display name.
 * @param {string} props.user.username - Username.
 * @param {string} props.user.role - User role ('admin' or 'user').
 * @param {string} props.user.createdAt - ISO date string of account creation.
 * @param {Object|null} [props.currentSession] - Current logged-in user session.
 * @param {Function} props.onDelete - Callback invoked with user id when delete is clicked.
 * @returns {JSX.Element} The rendered user row element.
 */
export function UserRow({ user, currentSession = null, onDelete }) {
  const isHardCodedAdmin = user.id === 'admin' || user.username === 'admin';
  const isSelf = currentSession && currentSession.userId === user.id;
  const deleteDisabled = isHardCodedAdmin || isSelf;

  const roleBadgeClasses =
    user.role === 'admin'
      ? 'bg-primary-100 text-primary-700 ring-1 ring-primary-300'
      : 'bg-neutral-100 text-neutral-700 ring-1 ring-neutral-300';

  function handleDelete() {
    if (!deleteDisabled && onDelete) {
      onDelete(user.id);
    }
  }

  return (
    <div className="flex items-center justify-between bg-white rounded-xl shadow-card p-4 sm:p-5">
      <div className="flex items-center space-x-3 min-w-0">
        <Avatar role={user.role} size="md" />
        <div className="min-w-0">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-sm font-semibold text-neutral-800 truncate">
              {user.displayName}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleBadgeClasses}`}
            >
              {user.role}
            </span>
          </div>
          <p className="text-xs text-neutral-500 truncate">@{user.username}</p>
          <p className="text-xs text-neutral-400 mt-0.5">
            Joined {formatDate(user.createdAt)}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleteDisabled}
        className={`flex-shrink-0 ml-4 inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          deleteDisabled
            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
            : 'bg-danger-50 text-danger-700 hover:bg-danger-100'
        }`}
        title={
          isHardCodedAdmin
            ? 'Cannot delete admin'
            : isSelf
              ? 'Cannot delete yourself'
              : 'Delete user'
        }
        aria-label={
          isHardCodedAdmin
            ? 'Cannot delete admin'
            : isSelf
              ? 'Cannot delete yourself'
              : `Delete ${user.displayName}`
        }
      >
        <svg
          className="w-4 h-4 mr-1"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        Delete
      </button>
    </div>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  currentSession: PropTypes.shape({
    userId: PropTypes.string,
    username: PropTypes.string,
    displayName: PropTypes.string,
    role: PropTypes.string,
  }),
  onDelete: PropTypes.func.isRequired,
};