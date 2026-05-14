import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';
import { BlogCard } from '../components/BlogCard.jsx';
import { getSession } from '../utils/auth.js';
import { getPosts } from '../utils/storage.js';

/**
 * Authenticated blog list page at route /blogs.
 * Displays all posts from localStorage in a responsive grid (1/2/3 columns).
 * Posts sorted newest first. Each post rendered as BlogCard with edit icon per ownership.
 * Empty state with CTA to /write if no posts. Uses Navbar.
 *
 * @returns {JSX.Element} The rendered blog list page.
 */
export default function Home() {
  const session = getSession();
  const posts = getPosts();

  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-800">All Posts</h1>
            <p className="text-neutral-600 mt-1">
              Discover stories from the community
            </p>
          </div>
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
            Write
          </Link>
        </div>

        {/* Posts Grid or Empty State */}
        {sortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {sortedPosts.map((post) => (
              <BlogCard key={post.id} post={post} session={session} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 text-3xl mb-4">
              <span>📝</span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-700 mb-2">
              No posts yet
            </h3>
            <p className="text-neutral-500 mb-6">
              Be the first to share your story with the community.
            </p>
            <Link
              to="/write"
              className="inline-flex items-center px-6 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors shadow-soft"
            >
              Write Your First Post
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}