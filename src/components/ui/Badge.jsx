import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({ children, variant = 'default', className, ...props }) {
  const variantClass = {
    default: 'badge-flat',
    accent: 'badge-flat accent',
    draft: 'badge-flat draft',
    published: 'badge-flat published',
  }[variant] || 'badge-flat';

  return (
    <span className={cn(variantClass, className)} {...props}>
      {children}
    </span>
  );
}
