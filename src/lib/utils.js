/**
 * General purpose utilities for devlog
 */

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0];
}

export function formatRelativeTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffSec < 60) return 'just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return formatDate(isoString);
}

export function calculateReadTime(text = '') {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function countWords(text = '') {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function generateSlug(title = '') {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Text scramble effect generator for monospace labels
 */
export function scrambleText(targetText, onUpdate, duration = 300) {
  const chars = '01_#/>-~%&*';
  const steps = 10;
  const intervalTime = duration / steps;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    const progress = step / steps;
    const scrambled = targetText
      .split('')
      .map((char, index) => {
        if (char === ' ' || char === '/' || char === '.') return char;
        if (index / targetText.length < progress) return char;
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');

    onUpdate(scrambled);

    if (step >= steps) {
      clearInterval(timer);
      onUpdate(targetText);
    }
  }, intervalTime);

  return () => clearInterval(timer);
}
