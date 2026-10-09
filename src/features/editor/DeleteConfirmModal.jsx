import React from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, postTitle }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="PURGE ENTRY // DELETE RECORD"
      subtitle="Permanent removal from client storage buffer"
      maxWidth="460px"
    >
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
          <AlertTriangle size={18} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ color: 'var(--text-primary)', marginBottom: '6px', fontWeight: 600 }}>
              Confirm deletion of this technical dispatch?
            </p>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--accent)',
                fontSize: '12px',
                margin: '4px 0',
                padding: '4px 8px',
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-default)',
              }}
            >
              {postTitle || 'untitled.md'}
            </p>
            <p style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '8px', fontFamily: 'var(--font-mono)' }}>
              [!] THIS RECORD WILL BE PURGED FROM LOCALSTORAGE_V4 AND CANNOT BE RECOVERED.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
          <Button variant="secondary" size="sm" onClick={onClose} style={{ borderRadius: 0 }}>
            ABORT
          </Button>
          <Button
            variant="danger"
            size="sm"
            style={{ borderRadius: 0 }}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            CONFIRM PURGE
          </Button>
        </div>
      </div>
    </Modal>
  );
}
