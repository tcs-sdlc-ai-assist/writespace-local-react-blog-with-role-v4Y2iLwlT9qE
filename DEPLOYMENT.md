# Deployment Guide

This document covers deploying WriteSpace to production. WriteSpace is a frontend-only single-page application (SPA) with no backend or database — all data is stored in the browser's localStorage.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build](#build)
- [Vercel Deployment](#vercel-deployment)
- [Environment Variables](#environment-variables)
- [SPA Rewrite Rules](#spa-rewrite-rules)
- [Other Hosting Platforms](#other-hosting-platforms)
- [CI/CD Notes](#cicd-notes)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- **Node.js** 18+ and **npm** 9+ installed locally (for building)
- A hosting platform account (Vercel, Netlify, Cloudflare Pages, GitHub Pages, etc.)
- Repository hosted on GitHub, GitLab, or Bitbucket (for automated deployments)

## Build

WriteSpace uses Vite as its build tool. To create a production build:

```bash
# Install dependencies
npm install

# Run the production build
npm run build
```

This generates optimized static assets in the `dist/` directory:

```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   └── index-[hash].css
└── vite.svg
```

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Install command:** `npm install`

To preview the production build locally before deploying:

```bash
npm run preview
```

## Vercel Deployment

Vercel is the recommended deployment platform for WriteSpace. It auto-detects Vite projects and requires minimal configuration.

### Automatic Deployment (Recommended)

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Vercel auto-detects the Vite framework. Verify the following settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **"Deploy"**.

Vercel will automatically redeploy on every push to the main branch.

### Manual Deployment via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from the project root
vercel

# Deploy to production
vercel --prod
```

### vercel.json Configuration

The project includes a `vercel.json` file at the repository root that configures SPA routing:

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

This configuration ensures that all routes (e.g., `/blogs`, `/admin`, `/blog/some-id`) are rewritten to `index.html`, allowing React Router to handle client-side routing. Without this rewrite rule, direct navigation to any route other than `/` would return a 404 error.

**Important:** Do not remove or modify `vercel.json` unless you understand the implications for client-side routing.

## Environment Variables

WriteSpace is a frontend-only application and **does not require any environment variables** to function. All data persistence is handled via the browser's localStorage.

### Optional Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_APP_TITLE` | `WriteSpace` | Override the application title |

If you want to customize the app title, set the environment variable in your hosting platform's dashboard or in a local `.env` file:

```bash
# Copy the example file
cp .env.example .env

# Edit .env
VITE_APP_TITLE=MyWritingPlatform
```

**Note:** All Vite environment variables must be prefixed with `VITE_` to be exposed to the client-side bundle. Variables are embedded at build time, not at runtime.

### Setting Environment Variables on Vercel

1. Go to your project on the Vercel dashboard.
2. Navigate to **Settings** → **Environment Variables**.
3. Add the variable name (e.g., `VITE_APP_TITLE`) and value.
4. Select the environments (Production, Preview, Development) where it should apply.
5. Redeploy for changes to take effect.

## SPA Rewrite Rules

WriteSpace uses React Router v6 for client-side routing. The application defines the following routes:

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/login` | Public | Login form |
| `/register` | Public | Registration form |
| `/blogs` | Authenticated | Blog post listing |
| `/write` | Authenticated | Create a new post |
| `/write?edit=:id` | Authenticated | Edit an existing post |
| `/blog/:id` | Authenticated | Read a single post |
| `/admin` | Admin only | Admin dashboard |
| `/users` | Admin only | User management |

All of these routes are handled client-side by React Router. The hosting platform must be configured to serve `index.html` for any request that does not match a static file. This is what the rewrite rule in `vercel.json` accomplishes.

If a user navigates directly to `/blogs` (e.g., by typing the URL or refreshing the page), the server must respond with `index.html` so that React Router can parse the URL and render the correct component.

## Other Hosting Platforms

### Netlify

Create a `netlify.toml` file in the project root (or configure via the Netlify dashboard):

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Alternatively, create a `_redirects` file inside the `public/` directory:

```
/*    /index.html   200
```

### Cloudflare Pages

1. Connect your repository in the Cloudflare Pages dashboard.
2. Set the build configuration:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. Cloudflare Pages automatically handles SPA routing for single-page applications — no additional configuration is needed.

### GitHub Pages

GitHub Pages does not natively support SPA rewrites. Use one of these workarounds:

1. **404.html trick:** Copy `dist/index.html` to `dist/404.html` after building. GitHub Pages serves `404.html` for unknown routes, which loads the SPA.

   ```bash
   npm run build
   cp dist/index.html dist/404.html
   ```

2. **Hash-based routing:** Switch React Router to use `HashRouter` instead of `BrowserRouter` (not recommended for production).

### Static File Server (Nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/writespace/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Static File Server (Apache)

Create a `.htaccess` file in the `dist/` directory:

```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## CI/CD Notes

### Automated Testing Before Deployment

It is recommended to run tests before every deployment. Add a test step to your CI/CD pipeline:

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build only if tests pass
npm run build
```

### Vercel CI/CD

Vercel automatically runs the build command on every push. To add a test step, you can use the Vercel **Ignored Build Step** or configure a GitHub Actions workflow:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-and-build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
```

### Branch Previews

Vercel automatically creates preview deployments for every pull request. Each preview deployment gets a unique URL, allowing you to test changes before merging to the main branch.

### Production Deployments

By default, Vercel deploys to production on every push to the `main` branch. You can configure this in the Vercel dashboard under **Settings** → **Git** → **Production Branch**.

## Troubleshooting

### Routes return 404 on page refresh

The hosting platform is not configured to serve `index.html` for all routes. Ensure the SPA rewrite rule is in place (see [SPA Rewrite Rules](#spa-rewrite-rules)).

### Blank page after deployment

1. Check the browser console for errors.
2. Verify the build completed successfully with `npm run build`.
3. Ensure the output directory is set to `dist` in your hosting platform.
4. Check that `index.html` references the correct asset paths (Vite handles this automatically).

### Environment variables not working

1. Ensure the variable is prefixed with `VITE_`.
2. Environment variables are embedded at **build time**. After changing a variable, you must rebuild and redeploy.
3. Access variables via `import.meta.env.VITE_*` — never `process.env`.

### localStorage data not persisting

localStorage is browser-specific and domain-specific. Data stored on one domain (e.g., `localhost:3000`) is not available on another (e.g., `yourapp.vercel.app`). Each deployment domain starts with a fresh localStorage state. The hard-coded admin account (username: `admin`, password: `admin`) is always available regardless of localStorage state.