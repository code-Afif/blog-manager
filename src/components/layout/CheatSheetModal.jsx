import React from 'react';
import { Modal } from '../ui/Modal';
import { useWorkspaceStore } from '../../store/workspaceStore';

const SHORTCUT_GROUPS = [
  {
    category: 'Reading & Navigation',
    items: [
      { keys: ['G', 'H'], label: 'Return to Home Feed' },
      { keys: ['N'], label: 'Compose new essay' },
      { keys: ['⌘', 'K'], label: 'Open search and action palette' },
      { keys: ['T'], label: 'Toggle Day Paper / Night Library' },
      { keys: ['Esc'], label: 'Dismiss open dialogs or modals' },
    ],
  },
  {
    category: 'Reading Shelf & Appreciation',
    items: [
      { keys: ['B'], label: 'Save / remove essay from Reading List' },
      { keys: ['L'], label: 'Appreciate current essay (heart)' },
      { keys: ['?'], label: 'Open keyboard guide' },
    ],
  },
  {
    category: 'Writing Suite (Rich-Text)',
    items: [
      { keys: ['Ctrl / ⌘', 'B'], label: 'Bold selection' },
      { keys: ['Ctrl / ⌘', 'I'], label: 'Italic selection' },
      { keys: ['Ctrl / ⌘', 'U'], label: 'Underline selection' },
      { keys: ['Ctrl / ⌘', 'K'], label: 'Insert link' },
      { keys: ['/'], label: 'Open insert menu on empty line' },
    ],
  },
];

export function CheatSheetModal() {
  const { cheatSheetOpen, setCheatSheetOpen } = useWorkspaceStore();

  return (
    <Modal
      isOpen={cheatSheetOpen}
      onClose={() => setCheatSheetOpen(false)}
      title="Keyboard Shortcuts"
      subtitle="Simple keys for reading and writing on Marginalia"
      maxWidth="500px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontFamily: 'var(--font-sans)' }}>
        {SHORTCUT_GROUPS.map((group) => (
          <div key={group.category}>
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
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
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-default)',
                borderRadius: '10px',
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
                    padding: '5px 0',
                    borderBottom: i < group.items.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {item.label}
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {item.keys.map((k, ki) => (
                      <kbd
                        key={ki}
                        style={{
                          padding: '2px 6px',
                          border: '1px solid var(--border-default)',
                          borderRadius: '4px',
                          backgroundColor: 'var(--bg-surface)',
                          fontSize: '11px',
                          fontFamily: 'var(--font-sans)',
                          color: 'var(--text-primary)',
                        }}
                      >
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
