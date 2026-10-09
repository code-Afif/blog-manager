import React from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, postTitle }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="DECOMMISSION FOLIO"
      subtitle="Permanent removal from archival memory"
      maxWidth="440px"
    >
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
          <AlertTriangle size={18} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ color: 'var(--text-primary)', marginBottom: '6px', fontWeight: 600 }}>
              Are you sure you wish to decommission this manuscript?
            </p>
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                margin: 0,
              }}
            >
              “{postTitle || 'Untitled Folio'}”
            </p>
            <p style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '8px' }}>
              This folio will be permanently unlinked from your local storage archive and cannot be retrieved.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
          <Button variant="ghost" size="sm" onClick={onClose}>
            PRESERVE (CANCEL)
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            CONFIRM DELETION
          </Button>
        </div>
      </div>
    </Modal>
  );
}
