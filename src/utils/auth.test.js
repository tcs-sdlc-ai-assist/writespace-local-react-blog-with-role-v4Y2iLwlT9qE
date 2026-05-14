import { describe, it, expect, beforeEach, vi } from 'vitest';
import { login, register, logout, getSession, isAdmin } from './auth.js';

describe('auth utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('login', () => {
    it('returns a session object for hard-coded admin credentials', () => {
      const session = login('admin', 'admin');
      expect(session).not.toBeNull();
      expect(session.userId).toBe('admin');
      expect(session.username).toBe('admin');
      expect(session.displayName).toBe('Admin');
      expect(session.role).toBe('admin');
    });

    it('saves session to localStorage on successful admin login', () => {
      login('admin', 'admin');
      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).not.toBeNull();
      expect(stored.userId).toBe('admin');
      expect(stored.role).toBe('admin');
    });

    it('returns a session object for a registered user with correct credentials', () => {
      const mockUsers = [
        {
          id: 'user1',
          displayName: 'Test User',
          username: 'testuser',
          password: 'pass1234',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      const session = login('testuser', 'pass1234');
      expect(session).not.toBeNull();
      expect(session.userId).toBe('user1');
      expect(session.username).toBe('testuser');
      expect(session.displayName).toBe('Test User');
      expect(session.role).toBe('user');
    });

    it('saves session to localStorage on successful user login', () => {
      const mockUsers = [
        {
          id: 'user1',
          displayName: 'Test User',
          username: 'testuser',
          password: 'pass1234',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      login('testuser', 'pass1234');
      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).not.toBeNull();
      expect(stored.userId).toBe('user1');
    });

    it('returns null for incorrect password', () => {
      const mockUsers = [
        {
          id: 'user1',
          displayName: 'Test User',
          username: 'testuser',
          password: 'pass1234',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      const session = login('testuser', 'wrongpassword');
      expect(session).toBeNull();
    });

    it('returns null for non-existent username', () => {
      const session = login('nonexistent', 'somepassword');
      expect(session).toBeNull();
    });

    it('returns null when username is empty', () => {
      const session = login('', 'password');
      expect(session).toBeNull();
    });

    it('returns null when password is empty', () => {
      const session = login('admin', '');
      expect(session).toBeNull();
    });

    it('returns null when username is null', () => {
      const session = login(null, 'password');
      expect(session).toBeNull();
    });

    it('returns null when password is null', () => {
      const session = login('admin', null);
      expect(session).toBeNull();
    });

    it('returns null when username is only whitespace', () => {
      const session = login('   ', 'password');
      expect(session).toBeNull();
    });

    it('returns null when password is only whitespace', () => {
      const session = login('admin', '   ');
      expect(session).toBeNull();
    });

    it('trims whitespace from username and password before matching', () => {
      const session = login('  admin  ', '  admin  ');
      expect(session).not.toBeNull();
      expect(session.userId).toBe('admin');
    });

    it('returns null for wrong admin password', () => {
      const session = login('admin', 'wrongpassword');
      expect(session).toBeNull();
    });
  });

  describe('register', () => {
    it('creates a new user and returns a session object', () => {
      const session = register('New User', 'newuser', 'pass1234');
      expect(session).not.toBeNull();
      expect(session).not.toBeInstanceOf(Error);
      expect(session.username).toBe('newuser');
      expect(session.displayName).toBe('New User');
      expect(session.role).toBe('user');
      expect(session.userId).toBeDefined();
    });

    it('saves the new user to localStorage', () => {
      register('New User', 'newuser', 'pass1234');
      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toBeDefined();
      const newUser = stored.find((u) => u.username === 'newuser');
      expect(newUser).toBeDefined();
      expect(newUser.displayName).toBe('New User');
      expect(newUser.password).toBe('pass1234');
      expect(newUser.role).toBe('user');
      expect(newUser.createdAt).toBeDefined();
    });

    it('saves session to localStorage on successful registration', () => {
      register('New User', 'newuser', 'pass1234');
      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).not.toBeNull();
      expect(stored.username).toBe('newuser');
      expect(stored.displayName).toBe('New User');
    });

    it('returns an Error when username is already taken', () => {
      register('First User', 'duplicate', 'pass1234');
      const result = register('Second User', 'duplicate', 'pass5678');
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Username taken');
    });

    it('returns an Error when username is "admin"', () => {
      const result = register('Admin User', 'admin', 'pass1234');
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Username reserved');
    });

    it('returns an Error when display name is empty', () => {
      const result = register('', 'newuser', 'pass1234');
      expect(result).toBeInstanceOf(Error);
    });

    it('returns an Error when username is empty', () => {
      const result = register('New User', '', 'pass1234');
      expect(result).toBeInstanceOf(Error);
    });

    it('returns an Error when password is empty', () => {
      const result = register('New User', 'newuser', '');
      expect(result).toBeInstanceOf(Error);
    });

    it('returns an Error when display name is null', () => {
      const result = register(null, 'newuser', 'pass1234');
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('All fields are required');
    });

    it('returns an Error when username is null', () => {
      const result = register('New User', null, 'pass1234');
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('All fields are required');
    });

    it('returns an Error when password is null', () => {
      const result = register('New User', 'newuser', null);
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('All fields are required');
    });

    it('returns an Error when username is less than 3 characters', () => {
      const result = register('New User', 'ab', 'pass1234');
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Username must be at least 3 characters');
    });

    it('returns an Error when password is less than 4 characters', () => {
      const result = register('New User', 'newuser', 'abc');
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Password must be at least 4 characters');
    });

    it('returns an Error when display name is only whitespace', () => {
      const result = register('   ', 'newuser', 'pass1234');
      expect(result).toBeInstanceOf(Error);
      expect(result.message).toBe('Display name is required');
    });

    it('trims whitespace from all fields', () => {
      const session = register('  New User  ', '  newuser  ', '  pass1234  ');
      expect(session).not.toBeInstanceOf(Error);
      expect(session.displayName).toBe('New User');
      expect(session.username).toBe('newuser');
    });

    it('assigns role "user" to newly registered users', () => {
      const session = register('New User', 'newuser', 'pass1234');
      expect(session).not.toBeInstanceOf(Error);
      expect(session.role).toBe('user');
    });

    it('generates a unique id for the new user', () => {
      const session1 = register('User One', 'userone', 'pass1234');
      const session2 = register('User Two', 'usertwo', 'pass5678');
      expect(session1).not.toBeInstanceOf(Error);
      expect(session2).not.toBeInstanceOf(Error);
      expect(session1.userId).not.toBe(session2.userId);
    });
  });

  describe('logout', () => {
    it('clears the session from localStorage', () => {
      login('admin', 'admin');
      expect(localStorage.getItem('writespace_session')).not.toBeNull();

      logout();
      expect(localStorage.getItem('writespace_session')).toBeNull();
    });

    it('does not throw when no session exists', () => {
      expect(() => logout()).not.toThrow();
    });

    it('makes getSession return null after logout', () => {
      login('admin', 'admin');
      expect(getSession()).not.toBeNull();

      logout();
      expect(getSession()).toBeNull();
    });
  });

  describe('getSession', () => {
    it('returns null when no session exists', () => {
      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns the session object after login', () => {
      login('admin', 'admin');
      const session = getSession();
      expect(session).not.toBeNull();
      expect(session.userId).toBe('admin');
      expect(session.username).toBe('admin');
      expect(session.role).toBe('admin');
    });

    it('returns the session object after registration', () => {
      register('New User', 'newuser', 'pass1234');
      const session = getSession();
      expect(session).not.toBeNull();
      expect(session.username).toBe('newuser');
      expect(session.displayName).toBe('New User');
      expect(session.role).toBe('user');
    });

    it('returns null after logout', () => {
      login('admin', 'admin');
      logout();
      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns null when localStorage contains corrupted session data', () => {
      localStorage.setItem('writespace_session', 'not valid json{{{');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const session = getSession();
      expect(session).toBeNull();

      consoleSpy.mockRestore();
    });
  });

  describe('isAdmin', () => {
    it('returns true for a session with role "admin"', () => {
      const session = { userId: 'admin', username: 'admin', displayName: 'Admin', role: 'admin' };
      expect(isAdmin(session)).toBe(true);
    });

    it('returns false for a session with role "user"', () => {
      const session = { userId: 'user1', username: 'testuser', displayName: 'Test', role: 'user' };
      expect(isAdmin(session)).toBe(false);
    });

    it('returns false for null session', () => {
      expect(isAdmin(null)).toBe(false);
    });

    it('returns false for undefined session', () => {
      expect(isAdmin(undefined)).toBe(false);
    });

    it('returns false for an array', () => {
      expect(isAdmin([1, 2, 3])).toBe(false);
    });

    it('returns false for a string', () => {
      expect(isAdmin('admin')).toBe(false);
    });

    it('returns false for a number', () => {
      expect(isAdmin(42)).toBe(false);
    });

    it('returns false for an object without role property', () => {
      expect(isAdmin({ userId: 'admin', username: 'admin' })).toBe(false);
    });

    it('returns false for an object with empty role', () => {
      expect(isAdmin({ userId: 'admin', role: '' })).toBe(false);
    });

    it('correctly identifies admin from a real login session', () => {
      const session = login('admin', 'admin');
      expect(isAdmin(session)).toBe(true);
    });

    it('correctly identifies non-admin from a real registration session', () => {
      const session = register('New User', 'newuser', 'pass1234');
      expect(session).not.toBeInstanceOf(Error);
      expect(isAdmin(session)).toBe(false);
    });
  });

  describe('integration: login then getSession', () => {
    it('getSession returns the same session data as login', () => {
      const loginSession = login('admin', 'admin');
      const retrievedSession = getSession();
      expect(retrievedSession).toEqual(loginSession);
    });

    it('register then login with same credentials returns valid session', () => {
      const regResult = register('Test User', 'testuser', 'testpass');
      expect(regResult).not.toBeInstanceOf(Error);

      logout();

      const loginSession = login('testuser', 'testpass');
      expect(loginSession).not.toBeNull();
      expect(loginSession.username).toBe('testuser');
      expect(loginSession.displayName).toBe('Test User');
      expect(loginSession.role).toBe('user');
    });

    it('multiple registrations create distinct users', () => {
      register('User One', 'userone', 'pass1111');
      logout();
      register('User Two', 'usertwo', 'pass2222');
      logout();

      const session1 = login('userone', 'pass1111');
      expect(session1).not.toBeNull();
      expect(session1.displayName).toBe('User One');

      logout();

      const session2 = login('usertwo', 'pass2222');
      expect(session2).not.toBeNull();
      expect(session2.displayName).toBe('User Two');

      expect(session1.userId).not.toBe(session2.userId);
    });

    it('login overwrites previous session', () => {
      register('User One', 'userone', 'pass1111');
      const firstSession = getSession();
      expect(firstSession.username).toBe('userone');

      login('admin', 'admin');
      const secondSession = getSession();
      expect(secondSession.username).toBe('admin');
      expect(secondSession.role).toBe('admin');
    });
  });
});