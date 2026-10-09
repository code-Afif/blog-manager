import React from 'react';
import { Modal } from '../ui/Modal';
import { useWorkspaceStore } from '../../store/workspaceStore';

const SHORTCUT_GROUPS = [
  {
    category: 'Catalogue & Folios',
    items: [
      { keys: ['J', 'K'], label: 'Advance / reverse selected folio in list' },
      { keys: ['Enter'], label: 'Open selected folio in reader' },
      { keys: ['G', 'H'], label: 'Return to Table of Contents' },
      { keys: ['/'], label: 'Focus catalog search inquiry' },
      { keys: ['⌘', 'K'], label: 'Open search and command palette' },
    ],
  },
  {
    category: 'Reading & Shelf',
    items: [
      { keys: ['B'], label: 'Preserve / remove active folio on Reading Shelf' },
      { keys: ['L'], label: 'Inscribe appreciation on current essay' },
      { keys: ['T'], label: 'Toggle Day / Night library ambiance' },
      { keys: ['?'], label: 'Toggle shortcut reference manual' },
      { keys: ['Esc'], label: 'Dismiss modal, palette, or drawer' },
    ],
  },
  {
    category: 'Editorial Composition (Write)',
    items: [
      { keys: ['Ctrl', 'S'], label: 'Preserve draft or publish folio' },
      { keys: ['Tab'], label: 'Switch between Write & Preview on mobile' },
    ],
  },
];

export function CheatSheetModal() {
  const { cheatSheetOpen, setCheatSheetOpen } = useWorkspaceStore();

  return (
    <Modal
      isOpen={cheatSheetOpen}
      onClose={() => setCheatSheetOpen(false)}
      title="KEYBOARD DIRECTIVES"
      subtitle="Complete keyboard navigability for the literary journal"
      maxWidth="500px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'var(--font-sans)' }}>
        {SHORTCUT_GROUPS.map((group) => (
          <div key={group.category}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--accent)',
                letterSpacing: '0.1em',
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
                padding: '8px 12px',
              }}
            >
              {group.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    padding: '4px 0',
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
