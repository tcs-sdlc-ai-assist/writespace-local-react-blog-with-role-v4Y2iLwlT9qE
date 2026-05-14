import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Avatar } from './Avatar.jsx';

/**
 * Truncate a string to a maximum length, appending ellipsis if truncated.
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - Maximum character length.
 * @returns {string} The truncated string.
 */
function truncate(text, maxLength = 120) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '…';
}

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
 * BlogCard component for displaying a blog post in a grid.
 * Shows title, excerpt (truncated content), date, author name with avatar,
 * and an edit icon if the current user has edit permission (admin or post owner).
 * Links to /blog/:id on click.
 *
 * @param {Object} props
 * @param {Object} props.post - The blog post object.
 * @param {string} props.post.id - Post ID.
 * @param {string} props.post.title - Post title.
 * @param {string} props.post.content - Post content.
 * @param {string} props.post.createdAt - ISO date string.
 * @param {string} props.post.authorId - Author user ID.
 * @param {string} props.post.authorName - Author display name.
 * @param {Object|null} [props.session] - Current user session object.
 * @returns {JSX.Element} The rendered blog card element.
 */
export function BlogCard({ post, session = null }) {
  const canEdit =
    session &&
    (session.role === 'admin' || session.userId === post.authorId);

  const authorRole = post.authorId === 'admin' ? 'admin' : 'user';

  return (
    <Link
      to={`/blog/${post.id}`}
      className="block bg-white rounded-xl shadow-card hover:shadow-soft transition-shadow duration-200 overflow-hidden group"
    >
      <div className="p-5 sm:p-6">
        {/* Title and Edit Icon */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-semibold text-neutral-800 group-hover:text-primary-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
          {canEdit && (
            <span
              className="flex-shrink-0 text-neutral-400 hover:text-primary-600 transition-colors mt-0.5"
              title="Edit post"
              aria-label="Edit post"
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
            </span>
          )}
        </div>

        {/* Excerpt */}
        <p className="text-neutral-600 text-sm leading-relaxed mb-4">
          {truncate(post.content, 120)}
        </p>

        {/* Footer: Author and Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar role={authorRole} size="sm" />
            <span className="text-sm font-medium text-neutral-700">
              {post.authorName}
            </span>
          </div>
          <span className="text-xs text-neutral-500">
            {formatDate(post.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    authorName: PropTypes.string.isRequired,
  }).isRequired,
  session: PropTypes.shape({
    userId: PropTypes.string,
    username: PropTypes.string,
    displayName: PropTypes.string,
    role: PropTypes.string,
  }),
};