import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { postService } from '../lib/postService';

const CONTENTS_TAB = {
  id: 'contents',
  slug: 'contents',
  title: 'Contents',
  type: 'contents',
  isPinned: true,
};

export const useWorkspaceStore = create(
  persist(
    (set, get) => ({
      // Theme: 'day' (default paper) or 'night' (midnight library)
      theme: 'day',
      setTheme: (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        try {
          localStorage.setItem('marginalia_theme', JSON.stringify({ state: { theme } }));
        } catch (_) {}
        set({ theme });
      },
      toggleTheme: () => {
        const next = get().theme === 'day' ? 'night' : 'day';
        document.documentElement.setAttribute('data-theme', next);
        try {
          localStorage.setItem('marginalia_theme', JSON.stringify({ state: { theme: next } }));
        } catch (_) {}
        set({ theme: next });
      },

      // Language: English only
      language: 'en',

      // Home Feed Tab: 'essays' | 'notes'
      homeTab: 'essays',
      setHomeTab: (tab) => set({ homeTab: tab }),

      // Notes Composer Modal
      notesComposerOpen: false,
      editingNote: null,
      openNotesComposer: (noteToEdit = null) =>
        set({ notesComposerOpen: true, editingNote: noteToEdit }),
      closeNotesComposer: () =>
        set({ notesComposerOpen: false, editingNote: null }),

      // Tabs
      openTabs: [CONTENTS_TAB],
      activeTabId: 'contents',

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
        if (tabId === 'contents') return; // Cannot close pinned Contents

        const newTabs = openTabs.filter((t) => t.id !== tabId);
        let nextActiveId = activeTabId;

        if (activeTabId === tabId) {
          const closedIndex = openTabs.findIndex((t) => t.id === tabId);
          const nextTab = newTabs[Math.max(0, closedIndex - 1)] || CONTENTS_TAB;
          nextActiveId = nextTab.id;
        }

        set({
          openTabs: newTabs.length > 0 ? newTabs : [CONTENTS_TAB],
          activeTabId: nextActiveId,
        });
      },

      setActiveTabId: (id) => set({ activeTabId: id }),

      // Primary Index View: 'contents' or 'shelf' (Reading list)
      indexView: 'contents', // 'contents' | 'shelf'
      setIndexView: (view) => set({ indexView: view }),

      // Layout display mode: 'list' | 'shelf'
      displayMode: 'list',
      setDisplayMode: (mode) => set({ displayMode: mode }),

      // Reading List (Shelf / bookmarks) & Appreciations (Likes)
      readingListIds: Array.from(postService.getReadingListIds()),
      appreciatedIds: Array.from(postService.getAppreciatedIds()),

      toggleReadingList: (essayId) => {
        postService.toggleReadingList(essayId);
        set({ readingListIds: Array.from(postService.getReadingListIds()) });
      },

      toggleAppreciation: async (essayId) => {
        const result = await postService.toggleAppreciation(essayId);
        set({ appreciatedIds: Array.from(postService.getAppreciatedIds()) });
        return result;
      },

      // Status Bar Metas
      activeWordCount: 0,
      setActiveWordCount: (count) => set({ activeWordCount: count }),

      activeReadTime: 0,
      setActiveReadTime: (time) => set({ activeReadTime: time }),

      isDraftSaved: true,
      setIsDraftSaved: (saved) => set({ isDraftSaved: saved }),

      // Dialog states
      commandPaletteOpen: false,
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      cheatSheetOpen: false,
      setCheatSheetOpen: (open) => set({ cheatSheetOpen: open }),

      aboutModalOpen: false,
      setAboutModalOpen: (open) => set({ aboutModalOpen: open }),

      editProfileModalOpen: false,
      setEditProfileModalOpen: (open) => set({ editProfileModalOpen: open }),

      // Refresh trigger
      essaysVersion: 0,
      incrementEssaysVersion: () => set((s) => ({ essaysVersion: s.essaysVersion + 1 })),
    }),
    {
      name: 'marginalia_workspace_store_v1',
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        homeTab: state.homeTab,
        openTabs: state.openTabs,
        activeTabId: state.activeTabId,
        indexView: state.indexView,
        displayMode: state.displayMode,
        readingListIds: state.readingListIds,
        appreciatedIds: state.appreciatedIds,
      }),
    }
  )
);
