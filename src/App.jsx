import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { WorkspaceLayout } from './components/layout/WorkspaceLayout';
import { PostIndex } from './features/posts/PostIndex';
import { PostReader } from './features/posts/PostReader';
import { PostEditor } from './features/editor/PostEditor';
import { MyPostsManager } from './features/editor/MyPostsManager';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useWorkspaceStore } from './store/workspaceStore';

export function App() {
  const { theme, setTheme } = useWorkspaceStore();

  useEffect(() => {
    // Sync stored theme or system preference
    const savedTheme = theme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (!theme) setTheme(savedTheme);
  }, [theme, setTheme]);

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<WorkspaceLayout />}>
          <Route index element={<PostIndex />} />
          <Route path="posts/:slug" element={<PostReader />} />
          <Route path="editor/new" element={<PostEditor />} />
          <Route path="editor/:slug" element={<PostEditor />} />
          <Route path="my-posts" element={<MyPostsManager />} />
          {/* Catch-all */}
          <Route path="*" element={<PostReader />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
