import React from 'react';
import { cn } from '../../lib/utils';

/**
 * Flat loading skeleton block without shimmer gradients
 */
export function Skeleton({ width = '100%', height = '16px', className, style }) {
  return (
    <div
      className={cn('skeleton-block', className)}
      style={{
        width,
        height,
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-1)',
        ...style,
      }}
    />
  );
}

export function SkeletonPostRow() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 14px',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <Skeleton width="28px" height="14px" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <Skeleton width="55%" height="16px" />
        <Skeleton width="30%" height="12px" />
      </div>
      <Skeleton width="60px" height="18px" />
      <Skeleton width="45px" height="14px" />
    </div>
  );
}
