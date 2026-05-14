/**
 * LocalStorage utility module for WriteSpace.
 * Provides CRUD helpers for posts, users, and session data.
 * All data is persisted in localStorage with JSON serialization.
 *
 * @module storage
 */

const KEYS = {
  POSTS: 'writespace_posts',
  USERS: 'writespace_users',
  SESSION: 'writespace_session',
};

const HARD_CODED_ADMIN = {
  id: 'admin',
  displayName: 'Admin',
  username: 'admin',
  password: 'admin',
  role: 'admin',
  createdAt: new Date('2024-01-01T00:00:00.000Z').toISOString(),
};

/**
 * Safely read and parse a value from localStorage.
 * @param {string} key - The localStorage key.
 * @returns {any|null} Parsed value or null on failure.
 */
function readFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return null;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Failed to read "${key}" from localStorage:`, error);
    return null;
  }
}

/**
 * Safely stringify and write a value to localStorage.
 * @param {string} key - The localStorage key.
 * @param {any} value - The value to persist.
 * @returns {boolean} True if write succeeded, false otherwise.
 */
function writeToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to write "${key}" to localStorage:`, error);
    return false;
  }
}

/**
 * Ensures the hard-coded admin user is always present in the users array.
 * @param {Array<Object>} users - Current users array.
 * @returns {Array<Object>} Users array guaranteed to contain the admin user.
 */
function ensureAdminExists(users) {
  const hasAdmin = users.some((u) => u.id === 'admin' || u.username === 'admin');
  if (!hasAdmin) {
    return [HARD_CODED_ADMIN, ...users];
  }
  return users;
}

/**
 * Get all posts from localStorage.
 * @returns {Array<Object>} Array of post objects.
 */
export function getPosts() {
  const posts = readFromStorage(KEYS.POSTS);
  if (!Array.isArray(posts)) {
    return [];
  }
  return posts;
}

/**
 * Save posts array to localStorage.
 * @param {Array<Object>} posts - Array of post objects to persist.
 * @returns {boolean} True if save succeeded.
 */
export function savePosts(posts) {
  if (!Array.isArray(posts)) {
    console.error('savePosts expects an array');
    return false;
  }
  return writeToStorage(KEYS.POSTS, posts);
}

/**
 * Get all users from localStorage.
 * Ensures the hard-coded admin user is always present.
 * @returns {Array<Object>} Array of user objects.
 */
export function getUsers() {
  const users = readFromStorage(KEYS.USERS);
  if (!Array.isArray(users)) {
    const defaultUsers = [HARD_CODED_ADMIN];
    writeToStorage(KEYS.USERS, defaultUsers);
    return defaultUsers;
  }
  const usersWithAdmin = ensureAdminExists(users);
  if (usersWithAdmin.length !== users.length) {
    writeToStorage(KEYS.USERS, usersWithAdmin);
  }
  return usersWithAdmin;
}

/**
 * Save users array to localStorage.
 * Ensures the hard-coded admin user is always present.
 * @param {Array<Object>} users - Array of user objects to persist.
 * @returns {boolean} True if save succeeded.
 */
export function saveUsers(users) {
  if (!Array.isArray(users)) {
    console.error('saveUsers expects an array');
    return false;
  }
  const usersWithAdmin = ensureAdminExists(users);
  return writeToStorage(KEYS.USERS, usersWithAdmin);
}

/**
 * Get the current session from localStorage.
 * @returns {Object|null} Session object or null if no session exists.
 */
export function getSession() {
  const session = readFromStorage(KEYS.SESSION);
  if (session === null || typeof session !== 'object' || Array.isArray(session)) {
    return null;
  }
  return session;
}

/**
 * Save a session object to localStorage.
 * @param {Object} session - Session object to persist.
 * @returns {boolean} True if save succeeded.
 */
export function saveSession(session) {
  if (session === null || typeof session !== 'object' || Array.isArray(session)) {
    console.error('saveSession expects a non-null object');
    return false;
  }
  return writeToStorage(KEYS.SESSION, session);
}

/**
 * Clear the current session from localStorage.
 * @returns {void}
 */
export function clearSession() {
  try {
    localStorage.removeItem(KEYS.SESSION);
  } catch (error) {
    console.error('Failed to clear session from localStorage:', error);
  }
}