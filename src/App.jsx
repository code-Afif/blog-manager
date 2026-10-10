import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { WorkspaceLayout } from './components/layout/WorkspaceLayout';
import { PostIndex } from './features/posts/PostIndex';
import { PostReader } from './features/posts/PostReader';
import { MyPostsManager } from './features/editor/MyPostsManager';
import { ExplorePage } from './features/explore/ExplorePage';
import { ActivityPage } from './features/activity/ActivityPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { AboutPage } from './components/common/AboutPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { useWorkspaceStore } from './store/workspaceStore';

// Lazy-load the rich-text authoring suite to keep initial bundle light and fast
const PostEditor = lazy(() =>
  import('./features/editor/PostEditor').then((module) => ({
    default: module.PostEditor,
  }))
);

/**
 * App — Root Application Component
 * Sets up routing, top-level ErrorBoundary, and theme synchronization.
 */
export function App() {
  const { theme, setTheme } = useWorkspaceStore();

  useEffect(() => {
    // Synchronize stored theme or system preference.
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
          {/* Home Feed & Archive */}
          <Route index element={<PostIndex />} />
          <Route path="discover" element={<PostIndex />} />
          <Route path="shelf" element={<PostIndex />} />
          <Route path="bookmarks" element={<PostIndex />} />
          <Route path="reading-list" element={<PostIndex />} />
          <Route path="archive" element={<PostIndex />} />

          {/* Social & Discovery Pages */}
          <Route path="explore" element={<ExplorePage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="writer/:handle" element={<ProfilePage />} />

          {/* Reading View */}
          <Route path="essays/:slug" element={<PostReader />} />
          <Route path="posts/:slug" element={<PostReader />} />
          <Route path="essay/:slug" element={<PostReader />} />

          {/* Substack-Style Rich-Text Editor (Lazy-Loaded) */}
          <Route
            path="write"
            element={
              <Suspense
                fallback={
                  <div
                    style={{
                      padding: '48px',
                      textAlign: 'center',
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      color: 'var(--text-muted)',
                    }}
                  >
                    Opening your desk...
                  </div>
                }
              >
                <PostEditor />
              </Suspense>
            }
          />
          <Route
            path="write/:id"
            element={
              <Suspense
                fallback={
                  <div
                    style={{
                      padding: '48px',
                      textAlign: 'center',
                      fontFamily: 'var(--font-serif)',
                      fontStyle: 'italic',
                      color: 'var(--text-muted)',
                    }}
                  >
                    Opening essay for editing...
                  </div>
                }
              >
                <PostEditor />
              </Suspense>
            }
          />
          <Route
            path="editor/new"
            element={
              <Suspense fallback={null}>
                <PostEditor />
              </Suspense>
            }
          />
          <Route
            path="editor/:slug"
            element={
              <Suspense fallback={null}>
                <PostEditor />
              </Suspense>
            }
          />

          {/* Author’s Desk */}
          <Route path="desk" element={<MyPostsManager />} />
          <Route path="my-posts" element={<MyPostsManager />} />
          <Route path="my-writing" element={<MyPostsManager />} />

          {/* About / Colophon */}
          <Route path="about" element={<AboutPage />} />

          {/* Fallback */}
          <Route path="*" element={<PostIndex />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
