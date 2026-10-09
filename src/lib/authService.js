import { storage } from './storage';

const STORAGE_KEYS = {
  USERS: 'stacktrace_auth_users_v1',
  SESSION: 'stacktrace_auth_session_v1',
  USER_BOOKMARKS_PREFIX: 'stacktrace_bookmarks_user_',
  USER_LIKES_PREFIX: 'stacktrace_likes_user_',
};

// Seed demo users matching the STACKTRACE masthead
const INITIAL_USERS = [
  {
    id: 'user-julian',
    name: 'Julian Vance',
    email: 'julian@stacktrace.journal',
    password: 'password123',
    initials: 'JV',
    role: 'Editor-in-Chief',
    memberNumber: 'ARCHIVE REF. 42B',
    bio: 'Editor-in-Chief of STACKTRACE Review. Essays on quietude, ink, and narrative cadence.',
    createdAt: '2025-01-15T00:00:00.000Z',
  },
  {
    id: 'user-clara',
    name: 'Clara Morisot',
    email: 'clara@stacktrace.journal',
    password: 'password123',
    initials: 'CM',
    role: 'Senior Essayist',
    memberNumber: 'ARCHIVE REF. 104A',
    bio: 'Essayist on attention, time, unproductive hours, and slow technology.',
    createdAt: '2025-02-01T00:00:00.000Z',
  },
  {
    id: 'user-tariq',
    name: 'Tariq Al-Mansoor',
    email: 'tariq@stacktrace.journal',
    password: 'password123',
    initials: 'TA',
    role: 'Field Correspondent',
    memberNumber: 'ARCHIVE REF. 219C',
    bio: 'Field dispatches from nocturnal cities, architecture, and subterranean soundscapes.',
    createdAt: '2025-02-20T00:00:00.000Z',
  },
];

class AuthService {
  constructor() {
    this._initUsers();
  }

  _initUsers() {
    const existing = storage.get(STORAGE_KEYS.USERS, null);
    if (!existing || existing.length === 0) {
      storage.set(STORAGE_KEYS.USERS, INITIAL_USERS);
    }
  }

  getUsers() {
    return storage.get(STORAGE_KEYS.USERS, INITIAL_USERS);
  }

  getCurrentUser() {
    return storage.get(STORAGE_KEYS.SESSION, null);
  }

  async login(email, password) {
    // Simulate slight network cadence for realistic UX
    await new Promise((r) => setTimeout(r, 180));

    const cleanEmail = (email || '').trim().toLowerCase();
    const users = this.getUsers();
    const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      throw new Error('No archival record found for this email address.');
    }

    if (user.password !== password) {
      throw new Error('Incorrect credentials for this reader record.');
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      initials: user.initials,
      role: user.role,
      memberNumber: user.memberNumber,
      bio: user.bio,
    };

    storage.set(STORAGE_KEYS.SESSION, sessionUser);
    return sessionUser;
  }

  async register(name, email, password) {
    await new Promise((r) => setTimeout(r, 220));

    const cleanName = (name || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();

    if (!cleanName) throw new Error('Please enter your full name.');
    if (!cleanEmail || !cleanEmail.includes('@')) throw new Error('Please enter a valid email address.');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.');

    const users = this.getUsers();
    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email is already registered in the archive.');
    }

    const nameParts = cleanName.split(/\s+/).filter(Boolean);
    const initials = nameParts.length >= 2
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : cleanName.slice(0, 2).toUpperCase();

    const randomNum = Math.floor(100 + Math.random() * 900);
    const newUser = {
      id: `user-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password,
      initials,
      role: 'Fellow Reader',
      memberNumber: `ARCHIVE REF. ${randomNum}R`,
      bio: 'Reader and subscriber to STACKTRACE Literary Review.',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    storage.set(STORAGE_KEYS.USERS, users);

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      initials: newUser.initials,
      role: newUser.role,
      memberNumber: newUser.memberNumber,
      bio: newUser.bio,
    };

    storage.set(STORAGE_KEYS.SESSION, sessionUser);
    return sessionUser;
  }

  logout() {
    storage.remove(STORAGE_KEYS.SESSION);
  }

  /**
   * Bookmarks scoped to user
   */
  getUserBookmarks(userId) {
    if (!userId) return [];
    return storage.get(`${STORAGE_KEYS.USER_BOOKMARKS_PREFIX}${userId}`, []);
  }

  toggleUserBookmark(userId, postId) {
    if (!userId) return false;
    const key = `${STORAGE_KEYS.USER_BOOKMARKS_PREFIX}${userId}`;
    const list = new Set(storage.get(key, []));
    const isSaved = list.has(postId);

    if (isSaved) {
      list.delete(postId);
    } else {
      list.add(postId);
    }

    const updated = Array.from(list);
    storage.set(key, updated);
    return !isSaved;
  }

  /**
   * Likes / Appreciations scoped to user
   */
  getUserLikes(userId) {
    if (!userId) return [];
    return storage.get(`${STORAGE_KEYS.USER_LIKES_PREFIX}${userId}`, []);
  }

  toggleUserLike(userId, postId) {
    if (!userId) return false;
    const key = `${STORAGE_KEYS.USER_LIKES_PREFIX}${userId}`;
    const list = new Set(storage.get(key, []));
    const isLiked = list.has(postId);

    if (isLiked) {
      list.delete(postId);
    } else {
      list.add(postId);
    }

    const updated = Array.from(list);
    storage.set(key, updated);
    return !isLiked;
  }

  /**
   * Merge guest bookmarks and likes when user logs in
   */
  syncGuestData(userId, guestBookmarks = [], guestLikes = []) {
    if (!userId) return;

    if (guestBookmarks && guestBookmarks.length > 0) {
      const bKey = `${STORAGE_KEYS.USER_BOOKMARKS_PREFIX}${userId}`;
      const userBookmarks = new Set(storage.get(bKey, []));
      guestBookmarks.forEach((id) => userBookmarks.add(id));
      storage.set(bKey, Array.from(userBookmarks));
    }

    if (guestLikes && guestLikes.length > 0) {
      const lKey = `${STORAGE_KEYS.USER_LIKES_PREFIX}${userId}`;
      const userLikes = new Set(storage.get(lKey, []));
      guestLikes.forEach((id) => userLikes.add(id));
      storage.set(lKey, Array.from(userLikes));
    }
  }
}

export const authService = new AuthService();
export { INITIAL_USERS };
