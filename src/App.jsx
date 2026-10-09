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
          {/* Public Table of Contents & Reading Shelf */}
          <Route index element={<PostIndex />} />

          {/* Folio Reader Routes */}
          <Route path="essays/:slug" element={<PostReader />} />
          <Route path="posts/:slug" element={<PostReader />} />
          <Route path="essay/:slug" element={<PostReader />} />

          {/* Editorial Composition Routes (Write) */}
          <Route path="write" element={<PostEditor />} />
          <Route path="editor/new" element={<PostEditor />} />
          <Route path="editor/:slug" element={<PostEditor />} />

          {/* Author’s Desk Management Routes */}
          <Route path="desk" element={<MyPostsManager />} />
          <Route path="my-posts" element={<MyPostsManager />} />

          {/* About & Colophon Page */}
          <Route path="about" element={<AboutPage />} />

          {/* Catch-all fallback Route */}
          <Route path="*" element={<PostReader />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
