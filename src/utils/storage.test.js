import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getPosts,
  savePosts,
  getUsers,
  saveUsers,
  getSession,
  saveSession,
  clearSession,
} from './storage.js';

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getPosts', () => {
    it('returns an empty array when no posts exist in localStorage', () => {
      const posts = getPosts();
      expect(posts).toEqual([]);
    });

    it('returns parsed posts array from localStorage', () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Test Post',
          content: 'Test content',
          createdAt: '2024-01-01T00:00:00.000Z',
          authorId: 'user1',
          authorName: 'User One',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(mockPosts));

      const posts = getPosts();
      expect(posts).toEqual(mockPosts);
      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe('Test Post');
    });

    it('returns an empty array when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_posts', '{not valid json!!!');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const posts = getPosts();
      expect(posts).toEqual([]);

      consoleSpy.mockRestore();
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_posts', JSON.stringify('not an array'));

      const posts = getPosts();
      expect(posts).toEqual([]);
    });

    it('returns an empty array when localStorage contains null', () => {
      localStorage.setItem('writespace_posts', JSON.stringify(null));

      const posts = getPosts();
      expect(posts).toEqual([]);
    });
  });

  describe('savePosts', () => {
    it('saves posts array to localStorage and returns true', () => {
      const mockPosts = [
        {
          id: '1',
          title: 'Test Post',
          content: 'Content',
          createdAt: '2024-01-01T00:00:00.000Z',
          authorId: 'user1',
          authorName: 'User One',
        },
      ];

      const result = savePosts(mockPosts);
      expect(result).toBe(true);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual(mockPosts);
    });

    it('returns false and logs error when given a non-array value', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = savePosts('not an array');
      expect(result).toBe(false);

      consoleSpy.mockRestore();
    });

    it('saves an empty array successfully', () => {
      const result = savePosts([]);
      expect(result).toBe(true);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual([]);
    });

    it('returns false when localStorage.setItem throws', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const result = savePosts([{ id: '1' }]);
      expect(result).toBe(false);

      consoleSpy.mockRestore();
    });
  });

  describe('getUsers', () => {
    it('returns array with hard-coded admin when no users exist in localStorage', () => {
      const users = getUsers();
      expect(users).toHaveLength(1);
      expect(users[0].id).toBe('admin');
      expect(users[0].username).toBe('admin');
      expect(users[0].role).toBe('admin');
      expect(users[0].displayName).toBe('Admin');
    });

    it('initializes localStorage with default admin user when no users exist', () => {
      getUsers();

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe('admin');
    });

    it('returns users from localStorage including hard-coded admin', () => {
      const mockUsers = [
        {
          id: 'admin',
          displayName: 'Admin',
          username: 'admin',
          password: 'admin',
          role: 'admin',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'user1',
          displayName: 'User One',
          username: 'userone',
          password: 'pass',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      const users = getUsers();
      expect(users).toHaveLength(2);
      expect(users[0].id).toBe('admin');
      expect(users[1].id).toBe('user1');
    });

    it('ensures admin user is added if missing from stored users', () => {
      const mockUsers = [
        {
          id: 'user1',
          displayName: 'User One',
          username: 'userone',
          password: 'pass',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      const users = getUsers();
      expect(users).toHaveLength(2);

      const adminUser = users.find((u) => u.id === 'admin');
      expect(adminUser).toBeDefined();
      expect(adminUser.username).toBe('admin');
      expect(adminUser.role).toBe('admin');
    });

    it('persists the admin user back to localStorage when it was missing', () => {
      const mockUsers = [
        {
          id: 'user1',
          displayName: 'User One',
          username: 'userone',
          password: 'pass',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(mockUsers));

      getUsers();

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toHaveLength(2);
      expect(stored.some((u) => u.id === 'admin')).toBe(true);
    });

    it('returns default admin array when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_users', 'corrupted{{{');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const users = getUsers();
      expect(users).toHaveLength(1);
      expect(users[0].id).toBe('admin');

      consoleSpy.mockRestore();
    });

    it('returns default admin array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_users', JSON.stringify('string value'));

      const users = getUsers();
      expect(users).toHaveLength(1);
      expect(users[0].id).toBe('admin');
    });
  });

  describe('saveUsers', () => {
    it('saves users array to localStorage and returns true', () => {
      const mockUsers = [
        {
          id: 'admin',
          displayName: 'Admin',
          username: 'admin',
          password: 'admin',
          role: 'admin',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
        {
          id: 'user1',
          displayName: 'User One',
          username: 'userone',
          password: 'pass',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
        },
      ];

      const result = saveUsers(mockUsers);
      expect(result).toBe(true);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toHaveLength(2);
    });

    it('ensures admin user is present when saving users without admin', () => {
      const mockUsers = [
        {
          id: 'user1',
          displayName: 'User One',
          username: 'userone',
          password: 'pass',
          role: 'user',
          createdAt: '2024-06-01T00:00:00.000Z',
        },
      ];

      const result = saveUsers(mockUsers);
      expect(result).toBe(true);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toHaveLength(2);
      expect(stored.some((u) => u.id === 'admin')).toBe(true);
    });

    it('returns false and logs error when given a non-array value', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = saveUsers('not an array');
      expect(result).toBe(false);

      consoleSpy.mockRestore();
    });

    it('returns false when localStorage.setItem throws', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const result = saveUsers([]);
      expect(result).toBe(false);

      consoleSpy.mockRestore();
    });
  });

  describe('getSession', () => {
    it('returns null when no session exists in localStorage', () => {
      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns parsed session object from localStorage', () => {
      const mockSession = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(mockSession));

      const session = getSession();
      expect(session).toEqual(mockSession);
      expect(session.userId).toBe('admin');
      expect(session.role).toBe('admin');
    });

    it('returns null when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_session', 'not json{{{');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const session = getSession();
      expect(session).toBeNull();

      consoleSpy.mockRestore();
    });

    it('returns null when localStorage contains an array', () => {
      localStorage.setItem('writespace_session', JSON.stringify([1, 2, 3]));

      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns null when localStorage contains a string value', () => {
      localStorage.setItem('writespace_session', JSON.stringify('a string'));

      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns null when localStorage contains null', () => {
      localStorage.setItem('writespace_session', JSON.stringify(null));

      const session = getSession();
      expect(session).toBeNull();
    });
  });

  describe('saveSession', () => {
    it('saves session object to localStorage and returns true', () => {
      const mockSession = {
        userId: 'user1',
        username: 'userone',
        displayName: 'User One',
        role: 'user',
      };

      const result = saveSession(mockSession);
      expect(result).toBe(true);

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(mockSession);
    });

    it('returns false when given null', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = saveSession(null);
      expect(result).toBe(false);

      consoleSpy.mockRestore();
    });

    it('returns false when given an array', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = saveSession([1, 2, 3]);
      expect(result).toBe(false);

      consoleSpy.mockRestore();
    });

    it('returns false when given a string', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const result = saveSession('not an object');
      expect(result).toBe(false);

      consoleSpy.mockRestore();
    });

    it('returns false when localStorage.setItem throws', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      const result = saveSession({ userId: 'user1', role: 'user' });
      expect(result).toBe(false);

      consoleSpy.mockRestore();
    });
  });

  describe('clearSession', () => {
    it('removes session from localStorage', () => {
      const mockSession = {
        userId: 'user1',
        username: 'userone',
        displayName: 'User One',
        role: 'user',
      };
      localStorage.setItem('writespace_session', JSON.stringify(mockSession));

      clearSession();

      const stored = localStorage.getItem('writespace_session');
      expect(stored).toBeNull();
    });

    it('does not throw when no session exists', () => {
      expect(() => clearSession()).not.toThrow();
    });

    it('handles localStorage.removeItem throwing gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage error');
      });

      expect(() => clearSession()).not.toThrow();

      consoleSpy.mockRestore();
    });
  });

  describe('integration: round-trip persistence', () => {
    it('saves and retrieves posts correctly', () => {
      const posts = [
        {
          id: 'p1',
          title: 'First Post',
          content: 'Hello world',
          createdAt: '2024-03-15T10:00:00.000Z',
          authorId: 'user1',
          authorName: 'User One',
        },
        {
          id: 'p2',
          title: 'Second Post',
          content: 'Another post',
          createdAt: '2024-03-16T10:00:00.000Z',
          authorId: 'admin',
          authorName: 'Admin',
        },
      ];

      savePosts(posts);
      const retrieved = getPosts();
      expect(retrieved).toEqual(posts);
      expect(retrieved).toHaveLength(2);
    });

    it('saves and retrieves users correctly with admin ensured', () => {
      const users = [
        {
          id: 'user1',
          displayName: 'User One',
          username: 'userone',
          password: 'pass1234',
          role: 'user',
          createdAt: '2024-03-15T10:00:00.000Z',
        },
      ];

      saveUsers(users);
      const retrieved = getUsers();
      expect(retrieved).toHaveLength(2);
      expect(retrieved.find((u) => u.id === 'admin')).toBeDefined();
      expect(retrieved.find((u) => u.id === 'user1')).toBeDefined();
    });

    it('saves and retrieves session correctly', () => {
      const session = {
        userId: 'user1',
        username: 'userone',
        displayName: 'User One',
        role: 'user',
      };

      saveSession(session);
      const retrieved = getSession();
      expect(retrieved).toEqual(session);
    });

    it('clearSession makes getSession return null', () => {
      saveSession({
        userId: 'user1',
        username: 'userone',
        displayName: 'User One',
        role: 'user',
      });

      expect(getSession()).not.toBeNull();

      clearSession();

      expect(getSession()).toBeNull();
    });
  });
});