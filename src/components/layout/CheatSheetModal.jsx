import React from 'react';
import { Modal } from '../ui/Modal';
import { useWorkspaceStore } from '../../store/workspaceStore';

const SHORTCUT_GROUPS = [
  {
    category: 'BUFFER NAVIGATION & TERMINAL',
    items: [
      { keys: ['J', 'K'], label: 'Advance / reverse selected dispatch in feed' },
      { keys: ['Enter'], label: 'Open selected dispatch in reader' },
      { keys: ['G', 'H'], label: 'Return to Feed Index' },
      { keys: ['/'], label: 'Focus telemetry search bar' },
      { keys: ['⌘', 'K'], label: 'Open command palette & search modal' },
    ],
  },
  {
    category: 'READER & TELEMETRY',
    items: [
      { keys: ['B'], label: 'Cache / unshelve active dispatch in local storage' },
      { keys: ['L'], label: 'Increment peer appreciation counter' },
      { keys: ['T'], label: 'Toggle Light Paper / Dark Terminal theme' },
      { keys: ['?'], label: 'Open system telemetry directive' },
      { keys: ['Esc'], label: 'Dismiss open modals, palette, or drawer' },
    ],
  },
  {
    category: 'AUTHORING STUDIO (WRITE)',
    items: [
      { keys: ['Ctrl', 'S'], label: 'Save local draft or publish dispatch' },
      { keys: ['Tab'], label: 'Switch between Write & Preview tabs on mobile' },
    ],
  },
];

export function CheatSheetModal() {
  const { cheatSheetOpen, setCheatSheetOpen } = useWorkspaceStore();

  return (
    <Modal
      isOpen={cheatSheetOpen}
      onClose={() => setCheatSheetOpen(false)}
      title="SYSTEM DIRECTIVES // KEYBOARD MAP"
      subtitle="Precision keyboard shortcuts for the STACKTRACE developer platform"
      maxWidth="520px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontFamily: 'var(--font-sans)' }}>
        {SHORTCUT_GROUPS.map((group) => (
          <div key={group.category}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10.5px',
                fontWeight: 700,
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
                borderRadius: 0,
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
                  <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-sans)' }}>
                    {item.label}
                  </span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {item.keys.map((k, ki) => (
                      <kbd key={ki} className="kbd-chip" style={{ borderRadius: 0, fontFamily: 'var(--font-mono)' }}>
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
