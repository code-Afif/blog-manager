/**
 * Safe localStorage wrapper with JSON serialization and fallback
 */

export const storage = {
  get: (key, fallback = null) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.warn(`[storage] Failed to get key "${key}":`, e);
      return fallback;
    }
  },

  set: (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`[storage] Failed to set key "${key}":`, e);
      return false;
    }
  },

  remove: (key) => {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn(`[storage] Failed to remove key "${key}":`, e);
      return false;
    }
  },
};
