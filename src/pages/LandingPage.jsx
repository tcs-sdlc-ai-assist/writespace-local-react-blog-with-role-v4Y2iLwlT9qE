import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar.jsx';
import { Footer } from '../components/Footer.jsx';
import { BlogCard } from '../components/BlogCard.jsx';
import { getSession } from '../utils/auth.js';
import { getPosts } from '../utils/storage.js';

/**
 * Public landing page for WriteSpace.
 * Displays hero section with CTAs, features cards, latest posts preview, and footer.
 * If user is already logged in, CTAs redirect to /blogs instead of /register and /login.
 *
 * @returns {JSX.Element} The rendered landing page.
 */
export default function LandingPage() {
  const session = getSession();
  const posts = getPosts();

  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const ctaPrimaryTo = session ? '/blogs' : '/register';
  const ctaPrimaryLabel = session ? 'Go to Blogs' : 'Get Started';
  const ctaSecondaryTo = session ? '/blogs' : '/login';
  const ctaSecondaryLabel = session ? 'Browse Posts' : 'Login';

  const features = [
    {
      icon: '✍️',
      title: 'Write Freely',
      description:
        'Create and publish your thoughts with a clean, distraction-free writing experience.',
    },
    {
      icon: '👥',
      title: 'Community Driven',
      description:
        'Join a growing community of writers and readers. Share ideas and discover new perspectives.',
    },
    {
      icon: '🔒',
      title: 'Role-Based Access',
      description:
        'Secure role-based system with admin and user roles for managing content and users.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Welcome to{' '}
            <span className="text-secondary-300">WriteSpace</span>
          </h1>
          <p className="text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto mb-10 leading-relaxed">
            A modern writing platform where ideas come to life. Create, share, and
            discover stories that matter.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={ctaPrimaryTo}
              className="inline-flex items-center px-8 py-3 rounded-lg bg-white text-primary-700 font-semibold text-lg hover:bg-neutral-100 transition-colors shadow-soft"
            >
              {ctaPrimaryLabel}
            </Link>
            <Link
              to={ctaSecondaryTo}
              className="inline-flex items-center px-8 py-3 rounded-lg border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              {ctaSecondaryLabel}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800 mb-4">
            Why WriteSpace?
          </h2>
          <p className="text-neutral-600 text-lg max-w-xl mx-auto">
            Everything you need to start writing and sharing your stories with the world.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl shadow-card p-6 sm:p-8 text-center hover:shadow-soft transition-shadow duration-200"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-primary-100 text-2xl mb-5">
                <span>{feature.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="bg-white border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800 mb-4">
              Latest Posts
            </h2>
            <p className="text-neutral-600 text-lg max-w-xl mx-auto">
              Discover the most recent stories from our community.
            </p>
          </div>
          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {latestPosts.map((post) => (
                <BlogCard key={post.id} post={post} session={session} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-100 text-3xl mb-4">
                <span>📝</span>
              </div>
              <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                No posts yet
              </h3>
              <p className="text-neutral-500 mb-6">
                Be the first to share your story with the community.
              </p>
              {!session && (
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors shadow-soft"
                >
                  Get Started
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}