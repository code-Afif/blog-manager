import React from 'react';
import { cn } from '../../lib/utils';

export function Button({
  children,
  variant = 'secondary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  className,
  disabled,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-mono font-medium border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-xs px-2 py-1 gap-1.5 h-6',
    md: 'text-xs px-3 py-1.5 gap-2 h-7',
    lg: 'text-sm px-4 py-2 gap-2.5 h-9',
  }[size] || 'text-xs px-3 py-1.5 gap-2 h-7';

  const variantStyles = {
    primary: 'button-primary',
    secondary: 'button-secondary',
    ghost: 'button-ghost',
    danger: 'button-danger',
  }[variant] || 'button-secondary';

  return (
    <button
      className={cn(baseStyles, sizeStyles, variantStyles, className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
