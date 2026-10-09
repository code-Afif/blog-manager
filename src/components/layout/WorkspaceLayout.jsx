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
import { BootSequence } from '../common/BootSequence';

export function WorkspaceLayout() {
  const navigate = useNavigate();
  const {
    sidebarOpen,
    commandPaletteOpen,
    setCommandPaletteOpen,
    cheatSheetOpen,
    setCheatSheetOpen,
    openTab,
    toggleStash,
  } = useWorkspaceStore();

  const [bootFinished, setBootFinished] = useState(
    Boolean(typeof window !== 'undefined' && sessionStorage.getItem('devlog_boot_done'))
  );

  // Workspace hotkeys:
  // mod+k -> Command Palette
  // n -> New post
  // ? -> Cheat sheet
  // g h -> Go home
  const hotkeyMap = React.useMemo(() => ({
    'mod+k': () => setCommandPaletteOpen(true),
    '?': () => setCheatSheetOpen(!cheatSheetOpen),
    n: () => {
      openTab({
        id: 'editor-new',
        slug: 'new-post',
        title: 'untitled.md',
        type: 'editor',
      });
      navigate('/editor/new');
    },
    'g h': () => {
      openTab({
        id: 'readme',
        slug: 'README.md',
        title: 'README.md',
        type: 'readme',
        isPinned: true,
      });
      navigate('/');
    },
    escape: () => {
      setCommandPaletteOpen(false);
      setCheatSheetOpen(false);
    },
  }), [setCommandPaletteOpen, setCheatSheetOpen, cheatSheetOpen, openTab, navigate]);

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
      {/* Boot Sequence Animation (once per session, < 1.2s, skippable) */}
      {!bootFinished && <BootSequence onComplete={() => setBootFinished(true)} />}

      {/* Top Breadcrumb Header */}
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

        {/* Main Editor Pane: TabBar + Content */}
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

      {/* Bottom Status Bar */}
      <StatusBar />

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
      />

      {/* Shortcut Cheat Sheet Modal */}
      <CheatSheetModal />
    </div>
  );
}
