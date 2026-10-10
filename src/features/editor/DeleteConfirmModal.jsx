import React from 'react';
import { Modal } from '../../components/ui/Modal';

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  postTitle,
  itemType = 'essay',
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Delete this ${itemType}?`}
      subtitle="This cannot be undone."
      maxWidth="440px"
    >
      <div style={{ fontFamily: 'var(--font-sans)', fontSize: '13px' }}>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 16px' }}>
          Are you sure you wish to delete <strong style={{ color: 'var(--text-primary)' }}>“{postTitle || 'Untitled'}”</strong>?
        </p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-default)',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '6px 14px',
              border: '1px solid var(--border-default)',
              backgroundColor: 'transparent',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            style={{
              padding: '6px 14px',
              border: '1px solid var(--danger)',
              backgroundColor: 'var(--danger)',
              color: '#FFFFFF',
              fontFamily: 'var(--font-sans)',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
