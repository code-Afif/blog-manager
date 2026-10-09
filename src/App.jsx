import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { WorkspaceLayout } from './components/layout/WorkspaceLayout';
import { PostIndex } from './features/posts/PostIndex';
import { PostReader } from './features/posts/PostReader';
import { PostEditor } from './features/editor/PostEditor';
import { MyPostsManager } from './features/editor/MyPostsManager';
import { AboutPage } from './components/common/AboutPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useWorkspaceStore } from './store/workspaceStore';

/**
 * App — Root Application Component
 * Sets up routing, top-level ErrorBoundary, and initial theme synchronization.
 */
export function App() {
  const { theme, setTheme } = useWorkspaceStore();

  useEffect(() => {
    // Non-obvious theme logic for interview explanation:
    // Synchronize stored theme or system preference. The head script in index.html
    // already set data-theme synchronously before first paint to prevent flashes.
    // Here we ensure Zustand state matches the active document data-theme attribute.
    const activeTheme = document.documentElement.getAttribute('data-theme') || theme || 'day';
    document.documentElement.setAttribute('data-theme', activeTheme);
    if (theme !== activeTheme) {
      setTheme(activeTheme);
    }
  }, [theme, setTheme]);

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<WorkspaceLayout />}>
          {/* Main Discover & Broadsheet Archive */}
          <Route index element={<PostIndex />} />
          <Route path="discover" element={<PostIndex />} />
          <Route path="shelf" element={<PostIndex />} />
          <Route path="bookmarks" element={<PostIndex />} />
          <Route path="archive" element={<PostIndex />} />

          {/* Folio Reader Routes */}
          <Route path="essays/:slug" element={<PostReader />} />
          <Route path="posts/:slug" element={<PostReader />} />
          <Route path="essay/:slug" element={<PostReader />} />

          {/* Editorial Composition Routes (Write a Story) */}
          <Route path="write" element={<PostEditor />} />
          <Route path="editor/new" element={<PostEditor />} />
          <Route path="editor/:slug" element={<PostEditor />} />

          {/* Author’s Desk Management Routes (My Writing) */}
          <Route path="desk" element={<MyPostsManager />} />
          <Route path="my-posts" element={<MyPostsManager />} />
          <Route path="my-writing" element={<MyPostsManager />} />

          {/* About & Colophon Page */}
          <Route path="about" element={<AboutPage />} />

          {/* Catch-all fallback Route */}
          <Route path="*" element={<PostIndex />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
