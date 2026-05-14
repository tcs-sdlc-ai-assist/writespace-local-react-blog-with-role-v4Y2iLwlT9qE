import { useState } from 'react';
import { Navbar } from '../components/Navbar.jsx';
import { UserRow } from '../components/UserRow.jsx';
import { getSession } from '../utils/auth.js';
import { getUsers, saveUsers } from '../utils/storage.js';

/**
 * Generate a simple unique ID.
 * @returns {string} A unique identifier string.
 */
function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 10);
}

/**
 * Admin-only user management page at route /users.
 * Displays all users using UserRow component.
 * Provides a create user form with display name, username, password, and role fields.
 * Delete user with confirmation dialog.
 * Hard-coded admin and self cannot be deleted.
 * Protected by ProtectedRoute with role='admin'.
 *
 * @returns {JSX.Element} The rendered user management page.
 */
export default function UserManagement() {
  const session = getSession();
  const [users, setUsers] = useState(() => getUsers());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(null);

  // Create user form state
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  /**
   * Validate the create user form fields.
   * @returns {string} Error message string, or empty string if valid.
   */
  function validateForm() {
    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedDisplayName) {
      return 'Display name is required';
    }

    if (!trimmedUsername) {
      return 'Username is required';
    }

    if (trimmedUsername.length < 3) {
      return 'Username must be at least 3 characters';
    }

    if (trimmedUsername === 'admin') {
      return 'Username "admin" is reserved';
    }

    if (!trimmedPassword) {
      return 'Password is required';
    }

    if (trimmedPassword.length < 4) {
      return 'Password must be at least 4 characters';
    }

    const existingUser = users.find((u) => u.username === trimmedUsername);
    if (existingUser) {
      return 'Username is already taken';
    }

    return '';
  }

  function handleCreateUser(e) {
    e.preventDefault();
    setFormError('');

    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    setFormLoading(true);

    try {
      const newUser = {
        id: generateId(),
        displayName: displayName.trim(),
        username: username.trim(),
        password: password.trim(),
        role: role,
        createdAt: new Date().toISOString(),
      };

      const updatedUsers = [...users, newUser];
      saveUsers(updatedUsers);
      setUsers(updatedUsers);

      // Reset form
      setDisplayName('');
      setUsername('');
      setPassword('');
      setRole('user');
      setFormError('');
      setShowCreateForm(false);
    } catch (err) {
      setFormError('An unexpected error occurred. Please try again.');
    } finally {
      setFormLoading(false);
    }
  }

  function handleDeleteUser(userId) {
    setShowConfirm(userId);
  }

  function confirmDelete() {
    if (!showConfirm) return;

    const updatedUsers = users.filter((u) => u.id !== showConfirm);
    saveUsers(updatedUsers);
    setUsers(getUsers());
    setShowConfirm(null);
  }

  function cancelDelete() {
    setShowConfirm(null);
  }

  const userToDelete = showConfirm ? users.find((u) => u.id === showConfirm) : null;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">User Management</h1>
            <p className="text-neutral-600 mt-1">
              Manage all users on the platform
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowCreateForm((prev) => !prev);
              setFormError('');
            }}
            className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors shadow-soft"
          >
            {showCreateForm ? (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Add User
              </>
            )}
          </button>
        </div>

        {/* Create User Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-card p-6 sm:p-8 mb-8">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">
              Create New User
            </h2>

            {formError && (
              <div
                className="mb-4 px-4 py-3 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm font-medium"
                role="alert"
              >
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Display Name Field */}
                <div>
                  <label
                    htmlFor="createDisplayName"
                    className="block text-sm font-medium text-neutral-700 mb-1.5"
                  >
                    Display Name
                  </label>
                  <input
                    id="createDisplayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter display name"
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-colors"
                  />
                </div>

                {/* Username Field */}
                <div>
                  <label
                    htmlFor="createUsername"
                    className="block text-sm font-medium text-neutral-700 mb-1.5"
                  >
                    Username
                  </label>
                  <input
                    id="createUsername"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username (min 3 characters)"
                    autoComplete="off"
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-colors"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="createPassword"
                    className="block text-sm font-medium text-neutral-700 mb-1.5"
                  >
                    Password
                  </label>
                  <input
                    id="createPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choose a password (min 4 characters)"
                    autoComplete="new-password"
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-colors"
                  />
                </div>

                {/* Role Field */}
                <div>
                  <label
                    htmlFor="createRole"
                    className="block text-sm font-medium text-neutral-700 mb-1.5"
                  >
                    Role
                  </label>
                  <select
                    id="createRole"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-colors"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormError('');
                    setDisplayName('');
                    setUsername('');
                    setPassword('');
                    setRole('user');
                  }}
                  className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className={`inline-flex items-center px-6 py-2.5 rounded-lg font-semibold text-white transition-colors shadow-soft ${
                    formLoading
                      ? 'bg-primary-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  {formLoading ? 'Creating…' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-800">
              All Users ({users.length})
            </h2>
          </div>

          {users.length > 0 ? (
            <div className="space-y-4">
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  currentSession={session}
                  onDelete={handleDeleteUser}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-card">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 text-3xl mb-4">
                <span>👥</span>
              </div>
              <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                No users found
              </h3>
              <p className="text-neutral-500">
                Create a new user to get started.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {showConfirm && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-soft p-6 sm:p-8 max-w-sm w-full">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-danger-50 text-2xl mb-4">
                <span>⚠️</span>
              </div>
              <h2 className="text-lg font-bold text-neutral-800 mb-2">
                Delete User
              </h2>
              <p className="text-sm text-neutral-600 mb-6">
                Are you sure you want to delete &quot;{userToDelete.displayName}&quot; (@{userToDelete.username})? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={cancelDelete}
                  className="inline-flex items-center px-5 py-2 rounded-lg text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="inline-flex items-center px-5 py-2 rounded-lg text-sm font-medium text-white bg-danger-600 hover:bg-danger-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}