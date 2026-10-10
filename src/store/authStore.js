import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, INITIAL_USERS } from '../lib/authService';
import { postService } from '../lib/postService';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: authService.getCurrentUser(),
      isAuthenticated: Boolean(authService.getCurrentUser()),

      // User's bookmarks and likes
      userBookmarks: authService.getCurrentUser()
        ? authService.getUserBookmarks(authService.getCurrentUser().id)
        : Array.from(postService.getReadingListIds()),
      userLikes: authService.getCurrentUser()
        ? authService.getUserLikes(authService.getCurrentUser().id)
        : Array.from(postService.getAppreciatedIds()),

      // Auth Modal UI
      authModalOpen: false,
      authModalTab: 'signin', // 'signin' | 'signup'
      pendingAction: null,
      authError: null,
      authLoading: false,

      openAuthModal: (tab = 'signin', pendingAction = null) => {
        set({
          authModalOpen: true,
          authModalTab: tab,
          pendingAction,
          authError: null,
        });
      },

      closeAuthModal: (continueAsGuest = false) => {
        const pending = get().pendingAction;
        set({
          authModalOpen: false,
          authError: null,
          pendingAction: null,
        });
        if (continueAsGuest && typeof pending === 'function') {
          pending();
        }
      },

      setAuthModalTab: (tab) => set({ authModalTab: tab, authError: null }),

      login: async (email, password) => {
        set({ authLoading: true, authError: null });
        try {
          const user = await authService.login(email, password);

          // Sync any guest bookmarks/likes into this user's account
          const guestBookmarks = get().userBookmarks || [];
          const guestLikes = get().userLikes || [];
          authService.syncGuestData(user.id, guestBookmarks, guestLikes);

          const updatedBookmarks = authService.getUserBookmarks(user.id);
          const updatedLikes = authService.getUserLikes(user.id);

          set({
            user,
            isAuthenticated: true,
            userBookmarks: updatedBookmarks,
            userLikes: updatedLikes,
            authLoading: false,
            authModalOpen: false,
            authError: null,
          });

          // Execute any pending action that was queued before opening auth modal
          const pending = get().pendingAction;
          if (typeof pending === 'function') {
            pending();
          }
          set({ pendingAction: null });

          return { success: true, user };
        } catch (err) {
          set({ authLoading: false, authError: err.message });
          return { success: false, error: err.message };
        }
      },

      register: async (name, email, password) => {
        set({ authLoading: true, authError: null });
        try {
          const user = await authService.register(name, email, password);

          // Sync guest bookmarks/likes
          const guestBookmarks = get().userBookmarks || [];
          const guestLikes = get().userLikes || [];
          authService.syncGuestData(user.id, guestBookmarks, guestLikes);

          const updatedBookmarks = authService.getUserBookmarks(user.id);
          const updatedLikes = authService.getUserLikes(user.id);

          set({
            user,
            isAuthenticated: true,
            userBookmarks: updatedBookmarks,
            userLikes: updatedLikes,
            authLoading: false,
            authModalOpen: false,
            authError: null,
          });

          const pending = get().pendingAction;
          if (typeof pending === 'function') {
            pending();
          }
          set({ pendingAction: null });

          return { success: true, user };
        } catch (err) {
          set({ authLoading: false, authError: err.message });
          return { success: false, error: err.message };
        }
      },

      loginAsDemo: async (email) => {
        set({ authLoading: true, authError: null });
        try {
          const demoUser = INITIAL_USERS.find(
            (u) => u.email.toLowerCase() === email.toLowerCase()
          ) || INITIAL_USERS[0];

          const user = await authService.login(demoUser.email, demoUser.password);

          const guestBookmarks = get().userBookmarks || [];
          const guestLikes = get().userLikes || [];
          authService.syncGuestData(user.id, guestBookmarks, guestLikes);

          const updatedBookmarks = authService.getUserBookmarks(user.id);
          const updatedLikes = authService.getUserLikes(user.id);

          set({
            user,
            isAuthenticated: true,
            userBookmarks: updatedBookmarks,
            userLikes: updatedLikes,
            authLoading: false,
            authModalOpen: false,
            authError: null,
          });

          const pending = get().pendingAction;
          if (typeof pending === 'function') {
            pending();
          }
          set({ pendingAction: null });

          return { success: true, user };
        } catch (err) {
          set({ authLoading: false, authError: err.message });
          return { success: false, error: err.message };
        }
      },

      logout: () => {
        authService.logout();
        set({
          user: null,
          isAuthenticated: false,
          userBookmarks: Array.from(postService.getReadingListIds()),
          userLikes: Array.from(postService.getAppreciatedIds()),
          pendingAction: null,
        });
      },

      // Unified Bookmark toggle (user-aware)
      toggleBookmark: (postId, forceGuest = false) => {
        const { user, openAuthModal } = get();

        // If not logged in and not explicitly forced as guest, prompt user to sign in
        if (!user && !forceGuest) {
          openAuthModal('signin', () => {
            get().toggleBookmark(postId, true);
          });
          return false;
        }

        if (user) {
          const isSaved = authService.toggleUserBookmark(user.id, postId);
          const updated = authService.getUserBookmarks(user.id);
          set({ userBookmarks: updated });
          postService.toggleReadingList(postId);
          return isSaved;
        } else {
          // Guest mode toggle
          postService.toggleReadingList(postId);
          const updated = Array.from(postService.getReadingListIds());
          set({ userBookmarks: updated });
          return updated.includes(postId);
        }
      },

      // Unified Like toggle (user-aware)
      toggleLike: async (postId, forceGuest = false) => {
        const { user, openAuthModal } = get();

        if (!user && !forceGuest) {
          openAuthModal('signin', () => {
            get().toggleLike(postId, true);
          });
          return { hasAppreciated: false, appreciations: 0 };
        }

        if (user) {
          const isLiked = authService.toggleUserLike(user.id, postId);
          const updatedLikes = authService.getUserLikes(user.id);
          set({ userLikes: updatedLikes });
          const res = await postService.toggleAppreciation(postId);
          return res;
        } else {
          // Guest mode toggle
          const res = await postService.toggleAppreciation(postId);
          const updated = Array.from(postService.getAppreciatedIds());
          set({ userLikes: updated });
          return res;
        }
      },

      isBookmarked: (postId) => {
        const { userBookmarks } = get();
        return Array.isArray(userBookmarks) && userBookmarks.includes(postId);
      },

      isLiked: (postId) => {
        const { userLikes } = get();
        return Array.isArray(userLikes) && userLikes.includes(postId);
      },
    }),
    {
      name: 'marginalia_auth_store_v1',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        userBookmarks: state.userBookmarks,
        userLikes: state.userLikes,
      }),
    }
  )
);
