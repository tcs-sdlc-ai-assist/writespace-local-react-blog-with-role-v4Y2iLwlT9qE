import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { getSession } from '../utils/auth.js';
import { getPosts, savePosts } from '../utils/storage.js';

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
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * Single blog post reader page at route /blog/:id.
 * Displays title, author with avatar, creation date, and full content.
 * Shows Edit and Delete buttons if user is admin or post owner.
 * Delete triggers confirmation dialog and removes post from localStorage.
 * Handles invalid/missing post IDs with error message and back link.
 * Uses Navbar.
 *
 * @returns {JSX.Element} The rendered blog post detail page.
 */
export default function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();
  const [showConfirm, setShowConfirm] = useState(false);

  const posts = getPosts();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-danger-50 text-3xl mb-4">
              <span>😕</span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-800 mb-2">
              Post Not Found
            </h1>
            <p className="text-neutral-600 mb-6">
              The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              to="/blogs"
              className="inline-flex items-center px-6 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors shadow-soft"
            >
              ← Back to Blogs
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const canEdit =
    session &&
    (session.role === 'admin' || session.userId === post.authorId);

  const authorRole = post.authorId === 'admin' ? 'admin' : 'user';

  function handleDelete() {
    const updatedPosts = posts.filter((p) => p.id !== post.id);
    savePosts(updatedPosts);
    navigate('/blogs', { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Link */}
        <Link
          to="/blogs"
          className="inline-flex items-center text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors mb-6"
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
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back to Blogs
        </Link>

        {/* Post Card */}
        <article className="bg-white rounded-xl shadow-card p-6 sm:p-8">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-neutral-800 mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Author and Date */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6 pb-6 border-b border-neutral-200">
            <div className="flex items-center space-x-3">
              <Avatar role={authorRole} size="md" />
              <div>
                <p className="text-sm font-semibold text-neutral-800">
                  {post.authorName}
                </p>
                <p className="text-xs text-neutral-500">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {canEdit && (
              <div className="flex items-center space-x-3">
                <Link
                  to={`/write?edit=${post.id}`}
                  className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-1.5"
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
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => setShowConfirm(true)}
                  className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-danger-700 bg-danger-50 hover:bg-danger-100 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-1.5"
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
            )}
          </div>

          {/* Content */}
          <div className="prose prose-neutral max-w-none">
            <p className="text-neutral-700 text-base leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        </article>
      </main>

      {/* Delete Confirmation Dialog */}
      {showConfirm && (
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
                Are you sure you want to delete &quot;{post.title}&quot;? This action cannot be undone.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="inline-flex items-center px-5 py-2 rounded-lg text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
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