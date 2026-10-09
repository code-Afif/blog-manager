import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { postService } from '../lib/postService';

const README_TAB = {
  id: 'readme',
  slug: 'README.md',
  title: 'README.md',
  type: 'readme',
  isPinned: true,
};

export const useWorkspaceStore = create(
  persist(
    (set, get) => ({
      // Theme: dark (default) or light
      theme: 'dark',
      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        set({ theme });
      },
      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        set({ theme: next });
      },

      // Tabs
      openTabs: [README_TAB],
      activeTabId: 'readme',

      openTab: (tab) => {
        const { openTabs } = get();
        const exists = openTabs.find((t) => t.id === tab.id || (t.slug && t.slug === tab.slug));
        if (exists) {
          set({ activeTabId: exists.id });
        } else {
          set({
            openTabs: [...openTabs, tab],
            activeTabId: tab.id,
          });
        }
      },

      closeTab: (tabId) => {
        const { openTabs, activeTabId } = get();
        if (tabId === 'readme') return; // Cannot close pinned README

        const newTabs = openTabs.filter((t) => t.id !== tabId);
        let nextActiveId = activeTabId;

        if (activeTabId === tabId) {
          const closedIndex = openTabs.findIndex((t) => t.id === tabId);
          const nextTab = newTabs[Math.max(0, closedIndex - 1)] || README_TAB;
          nextActiveId = nextTab.id;
        }

        set({
          openTabs: newTabs.length > 0 ? newTabs : [README_TAB],
          activeTabId: nextActiveId,
        });
      },

      setActiveTabId: (id) => set({ activeTabId: id }),

      // Sidebar
      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      sidebarView: 'explorer', // 'explorer' | 'bookmarks' | 'tags'
      setSidebarView: (view) => set({ sidebarView: view }),

      mobileDrawerOpen: false,
      setMobileDrawerOpen: (open) => set({ mobileDrawerOpen: open }),

      // Index view layout: list or grid
      viewMode: 'list',
      setViewMode: (mode) => set({ viewMode: mode }),

      // Stash (bookmarks) & Stars
      stashedIds: Array.from(postService.getStashedIds()),
      starredIds: Array.from(postService.getStarredIds()),

      toggleStash: (postId) => {
        postService.toggleStash(postId);
        set({ stashedIds: Array.from(postService.getStashedIds()) });
      },

      toggleStar: async (postId) => {
        const result = await postService.toggleStar(postId);
        set({ starredIds: Array.from(postService.getStarredIds()) });
        return result;
      },

      // Status Bar Metas
      cursorPosition: { line: 1, col: 1 },
      setCursorPosition: (pos) => set({ cursorPosition: pos }),

      activeWordCount: 0,
      setActiveWordCount: (count) => set({ activeWordCount: count }),

      activeReadTime: 0,
      setActiveReadTime: (time) => set({ activeReadTime: time }),

      isDraftSaved: true,
      setIsDraftSaved: (saved) => set({ isDraftSaved: saved }),

      // Command Palette & Shortcut Cheat Sheet
      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      cheatSheetOpen: false,
      setCheatSheetOpen: (open) => set({ cheatSheetOpen: open }),

      // Global Posts Trigger for reload
      postsVersion: 0,
      incrementPostsVersion: () => set((s) => ({ postsVersion: s.postsVersion + 1 })),
    }),
    {
      name: 'devlog_workspace_store',
      partialize: (state) => ({
        theme: state.theme,
        openTabs: state.openTabs,
        activeTabId: state.activeTabId,
        viewMode: state.viewMode,
        sidebarOpen: state.sidebarOpen,
        stashedIds: state.stashedIds,
      }),
    }
  )
);
