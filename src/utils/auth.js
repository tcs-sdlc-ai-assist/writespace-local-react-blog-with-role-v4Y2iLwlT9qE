/**
 * Authentication and session management utility module for WriteSpace.
 * Provides login, register, logout, session retrieval, and role checking.
 * Uses storage.js for user/session CRUD operations.
 *
 * @module auth
 */

import {
  getUsers,
  saveUsers,
  getSession as getStorageSession,
  saveSession,
  clearSession,
} from './storage.js';

/**
 * Generate a simple unique ID.
 * @returns {string} A unique identifier string.
 */
function generateId() {
  return Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 10);
}

/**
 * Attempt to log in a user with the given credentials.
 * Checks against the hard-coded admin first, then registered users.
 *
 * @param {string} username - The username to authenticate.
 * @param {string} password - The password to authenticate.
 * @returns {Object|null} A session object on success, or null on failure.
 */
export function login(username, password) {
  if (!username || !password) {
    return null;
  }

  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();

  if (!trimmedUsername || !trimmedPassword) {
    return null;
  }

  // Hard-coded admin check
  if (trimmedUsername === 'admin' && trimmedPassword === 'admin') {
    const session = {
      userId: 'admin',
      username: 'admin',
      displayName: 'Admin',
      role: 'admin',
    };
    saveSession(session);
    return session;
  }

  const users = getUsers();
  const user = users.find(
    (u) => u.username === trimmedUsername && u.password === trimmedPassword
  );

  if (!user) {
    return null;
  }

  const session = {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  };
  saveSession(session);
  return session;
}

/**
 * Register a new user account.
 * Validates inputs, checks for duplicate usernames, creates the user,
 * saves to storage, and returns a session.
 *
 * @param {string} displayName - The display name for the new user.
 * @param {string} username - The desired username (must be unique, min 3 chars).
 * @param {string} password - The desired password (min 4 chars).
 * @returns {Object|Error} A session object on success, or an Error on failure.
 */
export function register(displayName, username, password) {
  if (!displayName || !username || !password) {
    return new Error('All fields are required');
  }

  const trimmedDisplayName = displayName.trim();
  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();

  if (!trimmedDisplayName) {
    return new Error('Display name is required');
  }

  if (trimmedUsername.length < 3) {
    return new Error('Username must be at least 3 characters');
  }

  if (trimmedPassword.length < 4) {
    return new Error('Password must be at least 4 characters');
  }

  if (trimmedUsername === 'admin') {
    return new Error('Username reserved');
  }

  const users = getUsers();
  const existingUser = users.find((u) => u.username === trimmedUsername);

  if (existingUser) {
    return new Error('Username taken');
  }

  const newUser = {
    id: generateId(),
    displayName: trimmedDisplayName,
    username: trimmedUsername,
    password: trimmedPassword,
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);

  const session = {
    userId: newUser.id,
    username: newUser.username,
    displayName: newUser.displayName,
    role: newUser.role,
  };
  saveSession(session);
  return session;
}

/**
 * Log out the current user by clearing the session from localStorage.
 * @returns {void}
 */
export function logout() {
  clearSession();
}

/**
 * Get the current session from localStorage.
 * @returns {Object|null} The current session object, or null if not logged in.
 */
export function getSession() {
  return getStorageSession();
}

/**
 * Check if the given session belongs to an admin user.
 * @param {Object|null} session - The session object to check.
 * @returns {boolean} True if the session user has the admin role.
 */
export function isAdmin(session) {
  if (!session || typeof session !== 'object' || Array.isArray(session)) {
    return false;
  }
  return session.role === 'admin';
}