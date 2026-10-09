import React from 'react';
import { Modal } from '../ui/Modal';
import { useWorkspaceStore } from '../../store/workspaceStore';

const SHORTCUT_GROUPS = [
  {
    category: 'Navigation',
    items: [
      { keys: ['J', 'K'], label: 'Move up / down in post list' },
      { keys: ['Enter'], label: 'Open selected post in editor tab' },
      { keys: ['G', 'H'], label: 'Go home (open README.md tab)' },
      { keys: ['/'], label: 'Focus search input' },
      { keys: ['⌘', 'K'], label: 'Open command palette' },
    ],
  },
  {
    category: 'Actions',
    items: [
      { keys: ['N'], label: 'Create new markdown post' },
      { keys: ['B'], label: 'Toggle stash (bookmark) on active post' },
      { keys: ['?'], label: 'Toggle this shortcut cheat sheet' },
      { keys: ['Esc'], label: 'Close open modal / palette' },
    ],
  },
  {
    category: 'Editor & View',
    items: [
      { keys: ['Ctrl', 'S'], label: 'Save / publish draft post' },
      { keys: ['Tab'], label: 'Switch between Write & Preview (mobile)' },
    ],
  },
];

export function CheatSheetModal() {
  const { cheatSheetOpen, setCheatSheetOpen } = useWorkspaceStore();

  return (
    <Modal
      isOpen={cheatSheetOpen}
      onClose={() => setCheatSheetOpen(false)}
      title="KEYBOARD SHORTCUTS // CHEAT SHEET"
      subtitle="Full workspace keyboard operability"
      maxWidth="500px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'var(--font-mono)' }}>
        {SHORTCUT_GROUPS.map((group) => (
          <div key={group.category}>
            <div
              style={{
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--accent)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              {group.category}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-1)',
                padding: '8px 10px',
              }}
            >
              {group.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '11px',
                    padding: '3px 0',
                    borderBottom: i < group.items.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {item.keys.map((k, ki) => (
                      <kbd key={ki} className="kbd-chip">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
