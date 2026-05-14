import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import * as auth from './utils/auth.js';

vi.mock('./utils/auth.js', () => ({
  getSession: vi.fn(),
  isAdmin: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
}));

vi.mock('./utils/storage.js', () => ({
  getPosts: vi.fn(() => []),
  savePosts: vi.fn(() => true),
  getUsers: vi.fn(() => [
    {
      id: 'admin',
      displayName: 'Admin',
      username: 'admin',
      password: 'admin',
      role: 'admin',
      createdAt: '2024-01-01T00:00:00.000Z',
    },
  ]),
  saveUsers: vi.fn(() => true),
  getSession: vi.fn(() => null),
  saveSession: vi.fn(() => true),
  clearSession: vi.fn(),
}));

function LandingPage() {
  return <div>Landing Page</div>;
}

function LoginPage() {
  return <div>Login Page</div>;
}

function RegisterPage() {
  return <div>Register Page</div>;
}

function Home() {
  return <div>Home Page</div>;
}

function WriteBlog() {
  return <div>Write Blog Page</div>;
}

function ReadBlog() {
  return <div>Read Blog Page</div>;
}

function AdminDashboard() {
  return <div>Admin Dashboard Page</div>;
}

function UserManagement() {
  return <div>User Management Page</div>;
}

function renderWithRouter(initialEntries = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes - Any Authenticated User */}
        <Route element={<ProtectedRoute />}>
          <Route path="/blogs" element={<Home />} />
          <Route path="/write" element={<WriteBlog />} />
          <Route path="/edit/:id" element={<WriteBlog />} />
          <Route path="/blog/:id" element={<ReadBlog />} />
        </Route>

        {/* Protected Routes - Admin Only */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/users" element={<UserManagement />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

describe('App routing and access control', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    auth.getSession.mockReturnValue(null);
    auth.isAdmin.mockReturnValue(false);
  });

  describe('public routes', () => {
    it('renders the landing page at /', () => {
      renderWithRouter(['/']);
      expect(screen.getByText('Landing Page')).toBeInTheDocument();
    });

    it('renders the login page at /login', () => {
      renderWithRouter(['/login']);
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('renders the register page at /register', () => {
      renderWithRouter(['/register']);
      expect(screen.getByText('Register Page')).toBeInTheDocument();
    });

    it('renders public routes without any session', () => {
      auth.getSession.mockReturnValue(null);
      renderWithRouter(['/']);
      expect(screen.getByText('Landing Page')).toBeInTheDocument();
    });
  });

  describe('protected routes - unauthenticated users', () => {
    beforeEach(() => {
      auth.getSession.mockReturnValue(null);
      auth.isAdmin.mockReturnValue(false);
    });

    it('redirects /blogs to /login when not authenticated', () => {
      renderWithRouter(['/blogs']);
      expect(screen.queryByText('Home Page')).not.toBeInTheDocument();
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('redirects /write to /login when not authenticated', () => {
      renderWithRouter(['/write']);
      expect(screen.queryByText('Write Blog Page')).not.toBeInTheDocument();
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('redirects /blog/:id to /login when not authenticated', () => {
      renderWithRouter(['/blog/some-id']);
      expect(screen.queryByText('Read Blog Page')).not.toBeInTheDocument();
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('redirects /edit/:id to /login when not authenticated', () => {
      renderWithRouter(['/edit/some-id']);
      expect(screen.queryByText('Write Blog Page')).not.toBeInTheDocument();
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('redirects /admin to /login when not authenticated', () => {
      renderWithRouter(['/admin']);
      expect(screen.queryByText('Admin Dashboard Page')).not.toBeInTheDocument();
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('redirects /users to /login when not authenticated', () => {
      renderWithRouter(['/users']);
      expect(screen.queryByText('User Management Page')).not.toBeInTheDocument();
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  describe('protected routes - authenticated regular user', () => {
    const userSession = {
      userId: 'user1',
      username: 'testuser',
      displayName: 'Test User',
      role: 'user',
    };

    beforeEach(() => {
      auth.getSession.mockReturnValue(userSession);
      auth.isAdmin.mockImplementation((session) => {
        return session && session.role === 'admin';
      });
    });

    it('renders /blogs for authenticated user', () => {
      renderWithRouter(['/blogs']);
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    it('renders /write for authenticated user', () => {
      renderWithRouter(['/write']);
      expect(screen.getByText('Write Blog Page')).toBeInTheDocument();
    });

    it('renders /blog/:id for authenticated user', () => {
      renderWithRouter(['/blog/test-id']);
      expect(screen.getByText('Read Blog Page')).toBeInTheDocument();
    });

    it('renders /edit/:id for authenticated user', () => {
      renderWithRouter(['/edit/test-id']);
      expect(screen.getByText('Write Blog Page')).toBeInTheDocument();
    });

    it('redirects /admin to /blogs for non-admin user', () => {
      renderWithRouter(['/admin']);
      expect(screen.queryByText('Admin Dashboard Page')).not.toBeInTheDocument();
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    it('redirects /users to /blogs for non-admin user', () => {
      renderWithRouter(['/users']);
      expect(screen.queryByText('User Management Page')).not.toBeInTheDocument();
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });
  });

  describe('protected routes - authenticated admin user', () => {
    const adminSession = {
      userId: 'admin',
      username: 'admin',
      displayName: 'Admin',
      role: 'admin',
    };

    beforeEach(() => {
      auth.getSession.mockReturnValue(adminSession);
      auth.isAdmin.mockImplementation((session) => {
        return session && session.role === 'admin';
      });
    });

    it('renders /admin for admin user', () => {
      renderWithRouter(['/admin']);
      expect(screen.getByText('Admin Dashboard Page')).toBeInTheDocument();
    });

    it('renders /users for admin user', () => {
      renderWithRouter(['/users']);
      expect(screen.getByText('User Management Page')).toBeInTheDocument();
    });

    it('renders /blogs for admin user', () => {
      renderWithRouter(['/blogs']);
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    it('renders /write for admin user', () => {
      renderWithRouter(['/write']);
      expect(screen.getByText('Write Blog Page')).toBeInTheDocument();
    });

    it('renders /blog/:id for admin user', () => {
      renderWithRouter(['/blog/test-id']);
      expect(screen.getByText('Read Blog Page')).toBeInTheDocument();
    });
  });

  describe('navigation between routes', () => {
    it('public routes remain accessible regardless of auth state', () => {
      auth.getSession.mockReturnValue(null);
      renderWithRouter(['/']);
      expect(screen.getByText('Landing Page')).toBeInTheDocument();
    });

    it('switching from unauthenticated to authenticated allows protected routes', () => {
      auth.getSession.mockReturnValue(null);
      const { unmount } = renderWithRouter(['/blogs']);
      expect(screen.getByText('Login Page')).toBeInTheDocument();
      unmount();

      auth.getSession.mockReturnValue({
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      });
      auth.isAdmin.mockReturnValue(false);
      renderWithRouter(['/blogs']);
      expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    it('switching from regular user to admin allows admin routes', () => {
      const userSession = {
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      auth.getSession.mockReturnValue(userSession);
      auth.isAdmin.mockImplementation((s) => s && s.role === 'admin');

      const { unmount } = renderWithRouter(['/admin']);
      expect(screen.queryByText('Admin Dashboard Page')).not.toBeInTheDocument();
      expect(screen.getByText('Home Page')).toBeInTheDocument();
      unmount();

      const adminSession = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      auth.getSession.mockReturnValue(adminSession);

      renderWithRouter(['/admin']);
      expect(screen.getByText('Admin Dashboard Page')).toBeInTheDocument();
    });

    it('after logout, protected routes redirect to login', () => {
      const userSession = {
        userId: 'user1',
        username: 'testuser',
        displayName: 'Test User',
        role: 'user',
      };
      auth.getSession.mockReturnValue(userSession);
      auth.isAdmin.mockReturnValue(false);

      const { unmount } = renderWithRouter(['/blogs']);
      expect(screen.getByText('Home Page')).toBeInTheDocument();
      unmount();

      auth.getSession.mockReturnValue(null);
      renderWithRouter(['/blogs']);
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });
});