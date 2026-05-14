import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, getSession, isAdmin } from '../utils/auth.js';
import { PublicNavbar } from '../components/PublicNavbar.jsx';
import { Footer } from '../components/Footer.jsx';

/**
 * Login page component at route /login.
 * Provides a form with username and password fields, validation, and error messages.
 * Calls auth.login() on submit. On success, redirects admin to /admin, user to /blogs.
 * Already-authenticated users are redirected away.
 * Includes a link to /register.
 *
 * @returns {JSX.Element} The rendered login page.
 */
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const session = getSession();
    if (session) {
      if (isAdmin(session)) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/blogs', { replace: true });
      }
    }
  }, [navigate]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername) {
      setError('Username is required');
      return;
    }

    if (!trimmedPassword) {
      setError('Password is required');
      return;
    }

    setLoading(true);

    try {
      const session = login(trimmedUsername, trimmedPassword);

      if (!session) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }

      if (isAdmin(session)) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/blogs', { replace: true });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <PublicNavbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-100 text-2xl mb-4">
              <span>✍️</span>
            </div>
            <h1 className="text-3xl font-bold text-neutral-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-neutral-600">
              Sign in to your WriteSpace account
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-card p-6 sm:p-8">
            {error && (
              <div
                className="mb-4 px-4 py-3 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm font-medium"
                role="alert"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-neutral-700 mb-1.5"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  autoComplete="username"
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-colors"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-700 mb-1.5"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-semibold text-white transition-colors shadow-soft ${
                  loading
                    ? 'bg-primary-400 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700'
                }`}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-600">
                Don&apos;t have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}