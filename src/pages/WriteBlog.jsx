import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';
import { getSession } from '../utils/auth.js';
import { getPosts, savePosts } from '../utils/storage.js';

/**
 * Generate a simple unique ID.
 * @returns {string} A unique identifier string.
 */
function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 10);
}

const TITLE_MAX = 100;
const CONTENT_MAX = 2000;

/**
 * Blog create/edit page component.
 * Route /write for new posts, /write?edit=:id for editing.
 * Form with title and content fields, character counter, inline validation errors.
 * On edit, pre-fills form and enforces ownership (admin can edit any, user only own).
 * On save, persists to localStorage via savePosts() and redirects to /blog/:id or /blogs.
 * Uses Navbar.
 *
 * @returns {JSX.Element} The rendered write/edit blog page.
 */
export default function WriteBlog() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();
  const session = getSession();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [existingPost, setExistingPost] = useState(null);

  useEffect(() => {
    if (editId) {
      const posts = getPosts();
      const post = posts.find((p) => p.id === editId);

      if (!post) {
        navigate('/blogs', { replace: true });
        return;
      }

      const canEdit =
        session &&
        (session.role === 'admin' || session.userId === post.authorId);

      if (!canEdit) {
        navigate('/blogs', { replace: true });
        return;
      }

      setTitle(post.title);
      setContent(post.content);
      setIsEditing(true);
      setExistingPost(post);
    }
  }, [editId, navigate, session]);

  /**
   * Validate form fields and return errors object.
   * @returns {Object} Errors object with field keys and message values.
   */
  function validate() {
    const newErrors = {};
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      newErrors.title = 'Title is required';
    } else if (trimmedTitle.length > TITLE_MAX) {
      newErrors.title = `Title must be ${TITLE_MAX} characters or less`;
    }

    if (!trimmedContent) {
      newErrors.content = 'Content is required';
    } else if (trimmedContent.length > CONTENT_MAX) {
      newErrors.content = `Content must be ${CONTENT_MAX} characters or less`;
    }

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const posts = getPosts();
      const trimmedTitle = title.trim();
      const trimmedContent = content.trim();

      if (isEditing && existingPost) {
        const updatedPosts = posts.map((p) => {
          if (p.id === existingPost.id) {
            return {
              ...p,
              title: trimmedTitle,
              content: trimmedContent,
            };
          }
          return p;
        });
        savePosts(updatedPosts);
        navigate(`/blog/${existingPost.id}`, { replace: true });
      } else {
        const newPost = {
          id: generateId(),
          title: trimmedTitle,
          content: trimmedContent,
          createdAt: new Date().toISOString(),
          authorId: session.userId,
          authorName: session.displayName,
        };
        const updatedPosts = [...posts, newPost];
        savePosts(updatedPosts);
        navigate(`/blog/${newPost.id}`, { replace: true });
      }
    } catch (err) {
      setErrors({ form: 'An unexpected error occurred. Please try again.' });
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800">
            {isEditing ? 'Edit Post' : 'Write a New Post'}
          </h1>
          <p className="text-neutral-600 mt-1">
            {isEditing
              ? 'Update your post below'
              : 'Share your thoughts with the community'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-card p-6 sm:p-8">
          {errors.form && (
            <div
              className="mb-4 px-4 py-3 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm font-medium"
              role="alert"
            >
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Title
                </label>
                <span
                  className={`text-xs ${
                    title.trim().length > TITLE_MAX
                      ? 'text-danger-600 font-medium'
                      : 'text-neutral-500'
                  }`}
                >
                  {title.trim().length}/{TITLE_MAX}
                </span>
              </div>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your post title"
                className={`w-full px-4 py-2.5 rounded-lg border text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.title
                    ? 'border-danger-400 focus:ring-danger-400 focus:border-danger-400'
                    : 'border-neutral-300 focus:ring-primary-400 focus:border-primary-400'
                }`}
              />
              {errors.title && (
                <p className="mt-1.5 text-sm text-danger-600">{errors.title}</p>
              )}
            </div>

            {/* Content Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-neutral-700"
                >
                  Content
                </label>
                <span
                  className={`text-xs ${
                    content.trim().length > CONTENT_MAX
                      ? 'text-danger-600 font-medium'
                      : 'text-neutral-500'
                  }`}
                >
                  {content.trim().length}/{CONTENT_MAX}
                </span>
              </div>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post content here..."
                rows={12}
                className={`w-full px-4 py-2.5 rounded-lg border text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 transition-colors resize-y ${
                  errors.content
                    ? 'border-danger-400 focus:ring-danger-400 focus:border-danger-400'
                    : 'border-neutral-300 focus:ring-primary-400 focus:border-primary-400'
                }`}
              />
              {errors.content && (
                <p className="mt-1.5 text-sm text-danger-600">{errors.content}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => navigate(isEditing && existingPost ? `/blog/${existingPost.id}` : '/blogs')}
                className="inline-flex items-center px-5 py-2.5 rounded-lg text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center px-6 py-2.5 rounded-lg font-semibold text-white transition-colors shadow-soft ${
                  loading
                    ? 'bg-primary-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {loading
                  ? isEditing
                    ? 'Saving…'
                    : 'Publishing…'
                  : isEditing
                    ? 'Save Changes'
                    : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}