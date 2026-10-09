import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useHotkeys } from '../../hooks/useHotkeys';
import { TopBreadcrumbs } from './TopBreadcrumbs';
import { PublicationFooter } from './PublicationFooter';
import { CommandPalette } from '../../features/search/CommandPalette';
import { CheatSheetModal } from './CheatSheetModal';
import { AboutModal } from '../common/AboutModal';
import { AuthModal } from '../auth/AuthModal';

/**
 * WorkspaceLayout — STACKTRACE Publishing Platform Master Layout
 * Delivers the clean editorial broadsheet journal interface matching Stitch.
 */
export function WorkspaceLayout() {
  const navigate = useNavigate();
  const {
    commandPaletteOpen,
    setCommandPaletteOpen,
    cheatSheetOpen,
    setCheatSheetOpen,
    aboutModalOpen,
    setAboutModalOpen,
    toggleTheme,
    setIndexView,
  } = useWorkspaceStore();

  // Publishing platform hotkeys:
  // mod+k -> Search / Command Palette
  // n -> Write a story
  // ? -> Keyboard directives manual
  // g h -> Return to Discover
  // t -> Toggle Day / Night illumination
  // escape -> Dismiss open overlays
  const hotkeyMap = React.useMemo(() => ({
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
    },
  }), [setCommandPaletteOpen, setCheatSheetOpen, setAboutModalOpen, cheatSheetOpen, toggleTheme, navigate, setIndexView]);

  useHotkeys(hotkeyMap);

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
      {/* Top Archival Banner Rule, Masthead & Navigation Bar */}
      <TopBreadcrumbs />

      {/* Main Publication Viewport */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          width: '100%',
        }}
      >
        <Outlet />
      </main>

      {/* Shared Publication Footer (Stitch Section 6) */}
      <PublicationFooter />

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Keyboard Directives Modal */}
      <CheatSheetModal />

      {/* Colophon & About Publication Modal */}
      <AboutModal />

      {/* Reader Identification & Auth Modal */}
      <AuthModal />
    </div>
  );
}

