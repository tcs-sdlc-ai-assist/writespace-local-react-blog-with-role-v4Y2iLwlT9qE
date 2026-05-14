# Changelog

All notable changes to the WriteSpace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] - 2024-01-01

### Added

- **Public Landing Page** — Hero section with call-to-action buttons, feature highlight cards (Write Freely, Community Driven, Role-Based Access), and latest posts preview grid.
- **Authentication System** — Login and registration forms with client-side validation, session management via localStorage, and automatic redirect based on user role.
  - Hard-coded admin account (username: `admin`, password: `admin`) that cannot be deleted.
  - Registration with display name, username (min 3 characters), and password (min 4 characters) validation.
  - Duplicate username detection and reserved username (`admin`) protection.
- **Role-Based Route Guards** — `ProtectedRoute` component using React Router v6 `Outlet` pattern.
  - Unauthenticated users redirected to `/login`.
  - Non-admin users redirected to `/blogs` when accessing admin-only routes.
  - Admin users granted full access to all routes.
- **Blog CRUD with Ownership** — Full create, read, edit, and delete functionality for blog posts.
  - Create new posts at `/write` with title (max 100 characters) and content (max 2000 characters) fields with character counters.
  - Edit existing posts at `/write?edit=:id` with pre-filled form and ownership enforcement.
  - Read single posts at `/blog/:id` with full content display, author info, and action buttons.
  - Delete posts with confirmation dialog modal.
  - Users can only edit and delete their own posts; admins can edit and delete any post.
- **Admin Dashboard** — Platform overview at `/admin` with stat cards (total posts, total users, admin count, regular user count), quick action buttons, and a list of the 5 most recent posts with edit and delete controls.
- **User Management** — Admin-only page at `/users` to view all users, create new users with role assignment (user or admin), and delete users with confirmation dialog.
  - Hard-coded admin account and self-deletion protection.
  - `UserRow` component with avatar, role badge, username, join date, and delete button.
- **Avatar System** — Role-distinct `Avatar` component with crown emoji (👑) and purple/indigo background for admins, book emoji (📖) and blue/teal background for regular users. Supports `sm`, `md`, and `lg` size variants.
- **localStorage Persistence** — All data stored client-side under `writespace_posts`, `writespace_users`, and `writespace_session` keys with JSON serialization, error handling, and automatic admin user seeding.
- **Responsive Tailwind UI** — Mobile-first design with utility-first Tailwind CSS 3 styling.
  - Custom color palette (primary, secondary, neutral, success, danger) with full shade ranges.
  - Custom font families (Inter, Merriweather, Fira Code).
  - Custom box shadows (`soft`, `card`) for consistent elevation.
  - Responsive grid layouts (1/2/3 columns) for blog cards and feature cards.
  - Hamburger navigation menu for mobile viewports on both public and authenticated navbars.
- **Navigation Components** — `PublicNavbar` for unauthenticated pages and `Navbar` for authenticated pages with user avatar, display name, and logout button.
- **Footer Component** — Site footer with WriteSpace branding, contextual navigation links based on authentication state, and copyright notice.
- **Blog Card Component** — `BlogCard` with truncated excerpt, author avatar, formatted date, and conditional edit icon based on ownership.
- **Stat Card Component** — `StatCard` for admin dashboard with gradient backgrounds, icon display, and color theme variants.
- **Vercel SPA Deployment** — `vercel.json` configuration with catch-all rewrite to `index.html` for client-side routing support.
- **Testing Setup** — Vitest with jsdom environment, `@testing-library/react` and `@testing-library/user-event` for component testing, and `@testing-library/jest-dom` for DOM assertions.
  - Unit tests for `auth.js` utilities (login, register, logout, getSession, isAdmin).
  - Unit tests for `storage.js` utilities (getPosts, savePosts, getUsers, saveUsers, getSession, saveSession, clearSession).
  - Integration tests for routing and access control in `App.test.jsx`.