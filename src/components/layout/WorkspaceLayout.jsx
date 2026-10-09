import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { useHotkeys } from '../../hooks/useHotkeys';
import { TopBreadcrumbs } from './TopBreadcrumbs';
import { TabBar } from './TabBar';
import { SidebarExplorer } from './SidebarExplorer';
import { StatusBar } from './StatusBar';
import { MobileNav } from './MobileNav';
import { CommandPalette } from '../../features/search/CommandPalette';
import { CheatSheetModal } from './CheatSheetModal';
import { AboutModal } from '../common/AboutModal';
import { BootSequence } from '../common/BootSequence';

export function WorkspaceLayout() {
  const navigate = useNavigate();
  const {
    sidebarOpen,
    commandPaletteOpen,
    setCommandPaletteOpen,
    cheatSheetOpen,
    setCheatSheetOpen,
    aboutModalOpen,
    setAboutModalOpen,
    openTab,
    toggleTheme,
  } = useWorkspaceStore();

  const [bootFinished, setBootFinished] = useState(
    Boolean(typeof window !== 'undefined' && sessionStorage.getItem('marginalia_imprint_seen'))
  );

  // Literary journal hotkeys:
  // mod+k -> Search / Command Palette
  // n -> Compose new folio
  // ? -> Shortcut reference manual
  // g h -> Return to Table of Contents
  // t -> Toggle Day / Night library ambiance
  // escape -> Dismiss open overlays
  const hotkeyMap = React.useMemo(() => ({
    'mod+k': () => setCommandPaletteOpen(true),
    '?': () => setCheatSheetOpen(!cheatSheetOpen),
    t: () => toggleTheme(),
    n: () => {
      openTab({
        id: 'editor-new',
        slug: 'new-folio',
        title: 'untitled-folio.md',
        type: 'editor',
      });
      navigate('/write');
    },
    'g h': () => {
      openTab({
        id: 'contents',
        slug: 'contents',
        title: 'Contents',
        type: 'contents',
        isPinned: true,
      });
      navigate('/');
    },
    escape: () => {
      setCommandPaletteOpen(false);
      setCheatSheetOpen(false);
      setAboutModalOpen(false);
    },
  }), [setCommandPaletteOpen, setCheatSheetOpen, setAboutModalOpen, cheatSheetOpen, openTab, toggleTheme, navigate]);

  useHotkeys(hotkeyMap);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: 'var(--bg-canvas)',
      }}
    >
      {/* Publisher Imprint (shows briefly on first visit, skippable) */}
      {!bootFinished && <BootSequence onComplete={() => setBootFinished(true)} />}

      {/* Top Breadcrumb & Running Masthead Header */}
      <TopBreadcrumbs />

      {/* Center Layout: Sidebar + Main Area */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Desktop / Tablet Sidebar */}
        <div
          className={`sidebar-container ${sidebarOpen ? 'open' : 'closed'} desktop-tablet-only`}
          style={{
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
          }}
        >
          <SidebarExplorer />
        </div>

        {/* Main Folio Area: TabBar + Viewport */}
        <main
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            height: '100%',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <TabBar />
          <div
            className="main-viewport-content"
            style={{
              flex: 1,
              minHeight: 0,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      <MobileNav />

      {/* Bottom Editorial Colophon Status Bar */}
      <StatusBar />

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Keyboard Directives Modal */}
      <CheatSheetModal />

      {/* Colophon & About Publication Modal */}
      <AboutModal />
    </div>
  );
}
