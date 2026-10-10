import { storage } from './storage';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  USERS: 'marginalia_auth_users_v1',
  SESSION: 'marginalia_auth_session_v1',
  USER_BOOKMARKS_PREFIX: 'marginalia_bookmarks_user_',
  USER_LIKES_PREFIX: 'marginalia_likes_user_',
};

export const slugifyHandle = (text) =>
  (text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Seed demo users matching the MARGINALIA masthead
export const INITIAL_USERS = [
  {
    id: 'user-julian',
    name: 'Julian Vance',
    handle: 'julian-vance',
    email: 'julian@marginalia.journal',
    password: 'password123',
    initials: 'JV',
    role: 'Editor-in-Chief',
    memberNumber: 'ARCHIVE REF. 42B',
    bio: 'Editor-in-Chief of MARGINALIA Review. Essays on quietude, ink, and narrative cadence.',
    createdAt: '2025-01-15T00:00:00.000Z',
  },
  {
    id: 'user-clara',
    name: 'Clara Morisot',
    handle: 'clara-morisot',
    email: 'clara@marginalia.journal',
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
    handle: 'tariq-al-mansoor',
    email: 'tariq@marginalia.journal',
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
    } else {
      // Ensure existing users have handles
      let modified = false;
      const patched = existing.map((u) => {
        if (!u.handle) {
          modified = true;
          return { ...u, handle: slugifyHandle(u.name) || `reader-${u.id}` };
        }
        return u;
      });
      if (modified) {
        storage.set(STORAGE_KEYS.USERS, patched);
      }
    }

    // Auto-sync all local users and active session to Supabase in the background
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        this.syncAllUsersToSupabase().catch((err) =>
          console.warn('[authService] Supabase auto-sync warn:', err)
        );
      }, 500);
    }
  }

  /**
   * Sync a single user record to Supabase:
   * 1. Upserts into public.profiles (visible in Supabase Table Editor -> profiles)
   * 2. Registers in Supabase Auth (visible in Supabase Authentication -> Users)
   */
  async syncUserToSupabase(user) {
    if (!isSupabaseConfigured || !supabase || !user) return;

    try {
      const handle = user.handle || slugifyHandle(user.name) || `reader-${user.id}`;
      const initials =
        user.initials || (user.name ? user.name.slice(0, 2).toUpperCase() : 'MR');
      const memberNumber = user.memberNumber || user.member_number || '';

      const profilePayload = {
        id: String(user.id),
        name: user.name || 'Reader',
        handle,
        email: user.email || '',
        initials,
        role: user.role || 'Fellow Reader',
        bio: user.bio || '',
        member_number: memberNumber,
        updated_at: new Date().toISOString(),
      };

      if (user.createdAt || user.created_at) {
        profilePayload.created_at = user.createdAt || user.created_at;
      }

      // 1. Sync to public.profiles table
      const { error: profileError, status } = await supabase
        .from('profiles')
        .upsert(profilePayload);

      if (profileError) {
        console.warn('[Supabase Profiles Error]:', profileError.message);
      } else {
        console.log(
          `[Supabase Profiles] Synced: ${user.name} (${user.email || handle}) [status: ${status}]`
        );
      }

      // 2. Sync to Supabase Auth if credentials exist (shows in Authentication > Users)
      if (user.email && user.password && user.password.length >= 6) {
        try {
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: user.email,
            password: user.password,
            options: {
              data: {
                name: user.name,
                handle,
                role: profilePayload.role,
                initials,
              },
            },
          });
          if (authError) {
            if (!authError.message.toLowerCase().includes('already registered')) {
              console.log('[Supabase Auth Info]:', authError.message);
            }
          } else if (authData?.user) {
            console.log('[Supabase Auth] Created in auth.users:', authData.user.email);
          }
        } catch (authErr) {
          console.warn('[Supabase Auth signUp exception]:', authErr.message || authErr);
        }
      }
    } catch (err) {
      console.warn('[authService] syncUserToSupabase error:', err);
    }
  }

  /**
   * Sync all local archive users and the current session to Supabase
   */
  async syncAllUsersToSupabase() {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const users = this.getUsers();
      for (const u of users) {
        await this.syncUserToSupabase(u);
      }
      const current = this.getCurrentUser();
      if (current) {
        await this.syncUserToSupabase(current);
      }
    } catch (err) {
      console.warn('[authService] syncAllUsersToSupabase error:', err);
    }
  }

  getUsers() {
    const users = storage.get(STORAGE_KEYS.USERS, INITIAL_USERS);
    return users.map((u) => ({
      ...u,
      handle: u.handle || slugifyHandle(u.name) || `reader-${u.id}`,
    }));
  }

  getCurrentUser() {
    const user = storage.get(STORAGE_KEYS.SESSION, null);
    if (user && !user.handle) {
      user.handle = slugifyHandle(user.name) || `reader-${user.id}`;
      storage.set(STORAGE_KEYS.SESSION, user);
    }
    return user;
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
      handle: user.handle || slugifyHandle(user.name) || `reader-${user.id}`,
      email: user.email,
      initials: user.initials,
      role: user.role,
      memberNumber: user.memberNumber,
      bio: user.bio,
    };

    storage.set(STORAGE_KEYS.SESSION, sessionUser);

    // Sync profile to Supabase (profiles table & auth.users)
    await this.syncUserToSupabase({ ...sessionUser, password });

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

    const baseHandle = slugifyHandle(cleanName) || `reader-${Date.now().toString(36)}`;
    let handle = baseHandle;
    let counter = 1;
    while (users.some((u) => (u.handle || slugifyHandle(u.name)) === handle)) {
      handle = `${baseHandle}-${counter++}`;
    }

    const randomNum = Math.floor(100 + Math.random() * 900);
    const newUser = {
      id: `user-${Date.now()}`,
      name: cleanName,
      handle,
      email: cleanEmail,
      password,
      initials,
      role: 'Fellow Reader',
      memberNumber: `ARCHIVE REF. ${randomNum}R`,
      bio: 'Reader and subscriber to MARGINALIA Literary Review.',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    storage.set(STORAGE_KEYS.USERS, users);

    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      handle: newUser.handle,
      email: newUser.email,
      initials: newUser.initials,
      role: newUser.role,
      memberNumber: newUser.memberNumber,
      bio: newUser.bio,
    };

    storage.set(STORAGE_KEYS.SESSION, sessionUser);

    // Sync profile to Supabase (profiles table & auth.users)
    await this.syncUserToSupabase(newUser);

    return sessionUser;
  }

  logout() {
    storage.remove(STORAGE_KEYS.SESSION);
  }

  updateProfile(updates) {
    const current = this.getCurrentUser();
    if (!current) return null;

    let initials = current.initials;
    if (updates.name) {
      const parts = updates.name.trim().split(/\s+/).filter(Boolean);
      initials = parts.length >= 2
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : updates.name.slice(0, 2).toUpperCase();
    }

    let handle = current.handle;
    if (updates.handle) {
      handle = slugifyHandle(updates.handle);
    } else if (updates.name && (!handle || handle.startsWith('reader-'))) {
      handle = slugifyHandle(updates.name) || current.handle;
    }

    const updatedUser = {
      ...current,
      ...updates,
      handle,
      initials,
    };

    storage.set(STORAGE_KEYS.SESSION, updatedUser);

    const users = this.getUsers().map((u) =>
      u.id === current.id ? { ...u, ...updates, handle, initials } : u
    );
    storage.set(STORAGE_KEYS.USERS, users);

    // Sync to Supabase
    this.syncUserToSupabase(updatedUser);

    return updatedUser;
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
