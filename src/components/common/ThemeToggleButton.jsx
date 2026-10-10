import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspaceStore } from '../../store/workspaceStore';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggleButton({ size = 32 }) {
  const { theme, toggleTheme } = useWorkspaceStore();
  const isDay = theme === 'day';

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      aria-label={isDay ? 'Switch to Night mode' : 'Switch to Day mode'}
      title={isDay ? 'Switch to Night mode' : 'Switch to Day mode'}
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-default)',
        color: 'var(--text-primary)',
        cursor: 'pointer',
        padding: 0,
        overflow: 'hidden',
        boxShadow: isDay
          ? '0 1px 3px rgba(0, 0, 0, 0.05)'
          : '0 1px 4px rgba(0, 0, 0, 0.35)',
        transition: 'background-color var(--duration-fast), border-color var(--duration-fast), box-shadow var(--duration-fast)',
      }}
    >
      {/* Subtle atmospheric radial aura behind icon */}
      <motion.div
        animate={{
          background: isDay
            ? 'radial-gradient(circle, rgba(217, 119, 6, 0.18) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(129, 140, 248, 0.22) 0%, transparent 70%)',
        }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          borderRadius: '50%',
        }}
      />

      {/* Animated Sun & Moon Icon Transition */}
      <AnimatePresence mode="wait" initial={false}>
        {isDay ? (
          <motion.div
            key="sun-mode"
            initial={{ rotate: -140, scale: 0.2, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 140, scale: 0.2, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 360,
              damping: 20,
              mass: 0.7,
            }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent, #b45309)',
            }}
          >
            <Sun size={16} strokeWidth={2.2} />
          </motion.div>
        ) : (
          <motion.div
            key="moon-mode"
            initial={{ rotate: 140, scale: 0.2, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -140, scale: 0.2, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: 360,
              damping: 20,
              mass: 0.7,
            }}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent, #818cf8)',
            }}
          >
            <Moon size={15} strokeWidth={2.2} />

            {/* Micro celestial stars that twinkle in Night mode */}
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.85 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.12, duration: 0.2 }}
              style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                width: '3px',
                height: '3px',
                borderRadius: '50%',
                backgroundColor: 'currentColor',
                boxShadow: '0 0 4px currentColor',
                pointerEvents: 'none',
              }}
            />
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.65 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.2 }}
              style={{
                position: 'absolute',
                bottom: '-2px',
                left: '-2px',
                width: '2px',
                height: '2px',
                borderRadius: '50%',
                backgroundColor: 'currentColor',
                pointerEvents: 'none',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
