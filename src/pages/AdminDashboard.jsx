import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';
import { StatCard } from '../components/StatCard.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { getSession } from '../utils/auth.js';
import { getPosts, savePosts, getUsers } from '../utils/storage.js';

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
 * Truncate a string to a maximum length, appending ellipsis if truncated.
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - Maximum character length.
 * @returns {string} The truncated string.
 */
function truncate(text, maxLength = 60) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '…';
}

/**
 * Admin dashboard page at route /admin.
 * Displays stat cards for total posts, total users, admin count, and regular user count.
 * Shows quick action buttons and a list of the 5 most recent posts with edit/delete controls.
 * Protected by ProtectedRoute with role='admin'.
 *
 * @returns {JSX.Element} The rendered admin dashboard page.
 */
export default function AdminDashboard() {
  const session = getSession();
  const navigate = useNavigate();
  const [posts, setPosts] = useState(() => getPosts());
  const [showConfirm, setShowConfirm] = useState(null);

  const users = getUsers();

  const totalPosts = posts.length;
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const regularUserCount = users.filter((u) => u.role === 'user').length;

  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  function handleDelete(postId) {
    const updatedPosts = posts.filter((p) => p.id !== postId);
    savePosts(updatedPosts);
    setPosts(updatedPosts);
    setShowConfirm(null);
  }

  const postToDelete = showConfirm ? posts.find((p) => p.id === showConfirm) : null;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800">Admin Dashboard</h1>
          <p className="text-neutral-600 mt-1">
            Overview of your WriteSpace platform
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            title="Total Posts"
            value={totalPosts}
            icon="📝"
            color="primary"
          />
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon="👥"
            color="secondary"
          />
          <StatCard
            title="Admins"
            value={adminCount}
            icon="👑"
            color="success"
          />
          <StatCard
            title="Regular Users"
            value={regularUserCount}
            icon="📖"
            color="danger"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-neutral-800 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/write"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors shadow-soft"
            >
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
              Write New Post
            </Link>
            <Link
              to="/users"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-secondary-600 text-white font-semibold hover:bg-secondary-700 transition-colors shadow-soft"
            >
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
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
              Manage Users
            </Link>
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-neutral-800">
              Recent Posts
            </h2>
            <Link
              to="/blogs"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View All →
            </Link>
          </div>

          {recentPosts.length > 0 ? (
            <div className="space-y-4">
              {recentPosts.map((post) => {
                const authorRole = post.authorId === 'admin' ? 'admin' : 'user';

                return (
                  <div
                    key={post.id}
                    className="flex items-center justify-between bg-white rounded-xl shadow-card p-4 sm:p-5"
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <Avatar role={authorRole} size="sm" />
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/blog/${post.id}`}
                          className="text-sm font-semibold text-neutral-800 hover:text-primary-600 transition-colors truncate block"
                        >
                          {truncate(post.title, 60)}
                        </Link>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-xs text-neutral-500">
                            {post.authorName}
                          </span>
                          <span className="text-xs text-neutral-400">·</span>
                          <span className="text-xs text-neutral-400">
                            {formatDate(post.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                      <Link
                        to={`/write?edit=${post.id}`}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
                        title="Edit post"
                        aria-label={`Edit ${post.title}`}
                      >
                        <svg
                          className="w-4 h-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                      </Link>
                      <button
                        type="button"
                        onClick={() => setShowConfirm(post.id)}
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-danger-700 bg-danger-50 hover:bg-danger-100 transition-colors"
                        title="Delete post"
                        aria-label={`Delete ${post.title}`}
                      >
                        <svg
                          className="w-4 h-4"
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
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-card">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 text-3xl mb-4">
                <span>📝</span>
              </div>
              <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                No posts yet
              </h3>
              <p className="text-neutral-500 mb-6">
                Create the first post for your community.
              </p>
              <Link
                to="/write"
                className="inline-flex items-center px-6 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors shadow-soft"
              >
                Write Your First Post
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {showConfirm && postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-soft p-6 sm:p-8 max-w-sm w-full">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-danger-50 text-2xl mb-4">
                <span>⚠️</span>
              </div>
              <h2 className="text-lg font-bold text-neutral-800 mb-2">
                Delete Post
              </h2>
              <p className="text-sm text-neutral-600 mb-6">
                Are you sure you want to delete &quot;{postToDelete.title}&quot;? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowConfirm(null)}
                  className="inline-flex items-center px-5 py-2 rounded-lg text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(showConfirm)}
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