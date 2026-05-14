import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import Home from './pages/Home.jsx';
import WriteBlog from './pages/WriteBlog.jsx';
import ReadBlog from './pages/ReadBlog.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import UserManagement from './pages/UserManagement.jsx';

/**
 * Root application component.
 * Defines all routes using React Router v6.
 * Public routes: /, /login, /register.
 * Protected routes (any authenticated user): /blogs, /write, /edit/:id, /blog/:id.
 * Protected admin-only routes: /admin, /users.
 *
 * @returns {JSX.Element} The rendered application with routing.
 */
export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}