import React from 'react';
import { Outlet, useNavigate, useLocation, useOutlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useHotkeys } from '../../hooks/useHotkeys';
import { LiteraryMasthead } from './LiteraryMasthead';
import { LeftNavRail } from './LeftNavRail';
import { RightSidebar } from './RightSidebar';
import { PublicationFooter } from './PublicationFooter';
import { NotesComposerModal } from '../../features/notes/NotesComposerModal';
import { CommandPalette } from '../../features/search/CommandPalette';
import { CheatSheetModal } from './CheatSheetModal';
import { AboutModal } from '../common/AboutModal';
import { AuthModal } from '../auth/AuthModal';
import { EditProfileModal } from '../profile/EditProfileModal';

/**
 * WorkspaceLayout — Marginalia Literary Publishing Platform Master Layout
 * Implements the 3-zone Substack-inspired literary layout:
 * - Left rail: Wordmark, Home, Reading List, Explore, Activity, Profile, Create
 * - Centre column: Calm reading feed or story reader
 * - Right column: Search, Writers you follow, Recommended for you (desktop only)
 */
export function WorkspaceLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentOutlet = useOutlet();
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    cheatSheetOpen,
    setCheatSheetOpen,
    aboutModalOpen,
    setAboutModalOpen,
    editProfileModalOpen,
    setEditProfileModalOpen,
    toggleTheme,
    setIndexView,
  } = useWorkspaceStore();

  const pathname = location.pathname;
  const isEditorPage =
    pathname.startsWith('/write') ||
    pathname.startsWith('/editor/');

  const isReaderPage =
    pathname.startsWith('/essays/') ||
    pathname.startsWith('/posts/') ||
    pathname.startsWith('/essay/');

  const hotkeyMap = React.useMemo(
    () => ({
      'mod+k': () => setCommandPaletteOpen(true),
      '?': () => setCheatSheetOpen(!cheatSheetOpen),
      t: () => toggleTheme(),
      n: () => navigate('/write'),
      'g h': () => {
        setIndexView('contents');
        navigate('/');
      },
      escape: () => {
        setCommandPaletteOpen(false);
        setCheatSheetOpen(false);
        setAboutModalOpen(false);
        setEditProfileModalOpen(false);
      },
    }),
    [
      setCommandPaletteOpen,
      setCheatSheetOpen,
      setAboutModalOpen,
      setEditProfileModalOpen,
      cheatSheetOpen,
      toggleTheme,
      navigate,
      setIndexView,
    ]
  );

  useHotkeys(hotkeyMap);

  // If on the full-screen distraction-free editor route, render only the editor
  if (isEditorPage) {
    return (
      <div
        style={{
          minHeight: '100vh',
          width: '100%',
          backgroundColor: 'var(--bg-canvas)',
          color: 'var(--text-primary)',
        }}
      >
        <Outlet />
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'var(--bg-canvas)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Literary Masthead (wordmark, thin double rule, Day/Night & Language switcher) */}
      <LiteraryMasthead />

      {/* 3-Zone Master Grid */}
      <div
        className="marginalia-layout-grid"
        style={{
          display: 'flex',
          maxWidth: '1360px',
          margin: '0 auto',
          width: '100%',
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Left Navigation Rail */}
        <LeftNavRail />

        {/* Centre Viewport Column (calm reading width) with Liquid Slide Flow */}
        <main
          className="marginalia-main-container"
          style={{
            flex: 1,
            minWidth: 0,
            padding: '24px 24px 48px',
            position: 'relative',
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 14, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(3px)' }}
              transition={{
                duration: 0.22,
                ease: [0.22, 1, 0.36, 1], // fluid liquid flow ease
              }}
              style={{ width: '100%', minHeight: '100%' }}
            >
              {currentOutlet}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Right Sidebar Column (desktop only, hidden on reader page for wide reading canvas) */}
        {!isReaderPage && <RightSidebar />}
      </div>

      {/* Literary Publication Footer */}
      <PublicationFooter />

      {/* Centered Notes Composer Modal */}
      <NotesComposerModal />

      {/* Overlays and Modals */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />
      <CheatSheetModal />
      <AboutModal />
      <AuthModal />
      <EditProfileModal
        isOpen={editProfileModalOpen}
        onClose={() => setEditProfileModalOpen(false)}
      />
    </div>
  );
}


