# WriteSpace

A modern, frontend-only writing platform built with React 18+, Vite, and Tailwind CSS. Create, share, and discover stories with role-based access control — all powered by localStorage.

## Tech Stack

- **React 18+** — Component-based UI with hooks
- **Vite 5** — Fast dev server and optimized builds
- **Tailwind CSS 3** — Utility-first styling
- **React Router v6** — Client-side routing with protected routes
- **PropTypes** — Runtime prop validation
- **Vitest** — Unit and integration testing
- **localStorage** — Client-side data persistence (no backend required)

## Features

- **Public Landing Page** — Hero section, feature highlights, and latest posts preview
- **User Authentication** — Login and registration with session management via localStorage
- **Role-Based Access Control** — Admin and regular user roles with route guards
- **Blog Management** — Create, read, edit, and delete blog posts
- **Admin Dashboard** — Platform overview with stat cards, recent posts, and quick actions
- **User Management** — Admin-only page to create, view, and delete users
- **Responsive Design** — Mobile-first layout with hamburger navigation
- **Hard-Coded Admin** — Default admin account (username: `admin`, password: `admin`)

## Folder Structure

```
writespace/
├── index.html                  # Entry HTML file
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── vitest.config.js            # Vitest configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── vercel.json                 # Vercel deployment rewrites
├── .env.example                # Environment variable template
├── .gitignore                  # Git ignore rules
└── src/
    ├── main.jsx                # App entry point
    ├── App.jsx                 # Root component with routing
    ├── App.test.jsx            # Routing and access control tests
    ├── index.css               # Tailwind directives
    ├── setupTests.js           # Test setup (jest-dom)
    ├── components/
    │   ├── Avatar.jsx          # Role-distinct avatar component
    │   ├── BlogCard.jsx        # Blog post card for grid display
    │   ├── Footer.jsx          # Site footer with navigation
    │   ├── Navbar.jsx          # Authenticated navigation bar
    │   ├── ProtectedRoute.jsx  # Route guard for auth and roles
    │   ├── PublicNavbar.jsx    # Public navigation bar
    │   ├── StatCard.jsx        # Dashboard stat card
    │   └── UserRow.jsx         # User management row
    ├── pages/
    │   ├── AdminDashboard.jsx  # Admin dashboard (/admin)
    │   ├── Home.jsx            # Blog list (/blogs)
    │   ├── LandingPage.jsx     # Public landing page (/)
    │   ├── LoginPage.jsx       # Login form (/login)
    │   ├── ReadBlog.jsx        # Single post reader (/blog/:id)
    │   ├── RegisterPage.jsx    # Registration form (/register)
    │   ├── UserManagement.jsx  # User management (/users)
    │   └── WriteBlog.jsx       # Create/edit post (/write)
    └── utils/
        ├── auth.js             # Authentication and session utilities
        ├── auth.test.js        # Auth utility tests
        ├── storage.js          # localStorage CRUD helpers
        └── storage.test.js     # Storage utility tests
```

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** 9+ installed

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd writespace

# Install dependencies
npm install
```

### Development

```bash
# Start the development server on http://localhost:3000
npm run dev
```

The dev server opens automatically in your default browser with hot module replacement enabled.

### Build

```bash
# Create a production build in the dist/ directory
npm run build
```

### Preview Production Build

```bash
# Serve the production build locally
npm run preview
```

### Testing

```bash
# Run all tests
npm test
```

Tests use Vitest with jsdom environment and @testing-library/react for component testing.

## Usage Guide

### Default Admin Account

The application ships with a hard-coded admin account:

- **Username:** `admin`
- **Password:** `admin`

This account cannot be deleted and is always available.

### Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page with hero, features, and latest posts |
| `/login` | Public | Login form |
| `/register` | Public | Registration form |
| `/blogs` | Authenticated | All blog posts grid |
| `/write` | Authenticated | Create a new blog post |
| `/write?edit=:id` | Authenticated | Edit an existing blog post |
| `/blog/:id` | Authenticated | Read a single blog post |
| `/admin` | Admin only | Admin dashboard with stats and recent posts |
| `/users` | Admin only | User management (create, view, delete users) |

### User Roles

- **User** — Can create, read, edit, and delete their own posts
- **Admin** — Full access to all posts, admin dashboard, and user management

### Data Persistence

All data (users, posts, sessions) is stored in the browser's localStorage under the following keys:

- `writespace_posts` — Array of blog post objects
- `writespace_users` — Array of user objects (admin always included)
- `writespace_session` — Current session object

Clearing your browser's localStorage will reset all data.

## Environment Variables

No environment variables are required. An optional override is available:

| Variable | Default | Description |
|---|---|---|
| `VITE_APP_TITLE` | `WriteSpace` | Override the application title |

Copy `.env.example` to `.env` to customize:

```bash
cp .env.example .env
```

## Deployment

### Vercel

This project includes a `vercel.json` configuration for seamless deployment on Vercel with SPA rewrites.

1. Push your repository to GitHub, GitLab, or Bitbucket
2. Import the project in [Vercel](https://vercel.com)
3. Vercel auto-detects Vite — no additional configuration needed
4. Deploy

The `vercel.json` rewrites all routes to `index.html` for client-side routing:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Other Platforms

For any static hosting platform (Netlify, GitHub Pages, Cloudflare Pages):

1. Run `npm run build`
2. Deploy the `dist/` directory
3. Configure a catch-all redirect to `index.html` for SPA routing

## License

Private — All rights reserved.