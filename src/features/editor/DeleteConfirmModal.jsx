import React from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { AlertTriangle } from 'lucide-react';

export function DeleteConfirmModal({ isOpen, onClose, onConfirm, postTitle, postFilename }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="CONFIRM FILE DELETION"
      subtitle="rm -rf target file"
      maxWidth="420px"
    >
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '14px' }}>
          <AlertTriangle size={18} style={{ color: 'var(--danger)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <p style={{ color: 'var(--text-primary)', marginBottom: '6px', fontWeight: 600 }}>
              Are you sure you want to delete this post?
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '11px', margin: 0 }}>
              File: <code className="inline-code">{postFilename || 'untitled.md'}</code>
            </p>
            <p style={{ color: 'var(--danger)', fontSize: '11px', marginTop: '6px' }}>
              This action unlinks the markdown document from your workspace.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
          <Button variant="ghost" size="sm" onClick={onClose}>
            CANCEL
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            CONFIRM DELETE
          </Button>
        </div>
      </div>
    </Modal>
  );
}
