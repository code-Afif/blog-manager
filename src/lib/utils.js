/**
 * General purpose utilities for STACKTRACE Developer Publishing Platform
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

/**
 * Reading time calculation:
 * Standard ~220 words per minute for technical prose and code blocks.
 */
export function calculateReadTime(text = '', lang = 'en') {
  const words = countWords(text);
  return Math.max(1, Math.ceil(words / 220));
}

/**
 * Word count by splitting on whitespace
 */
export function countWords(text = '') {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Generate clean URL slug
 */
export function generateSlug(title = '') {
  const clean = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (clean) return clean;
  return `entry-${Date.now().toString(36)}`;
}

/**
 * Generate DOM-safe Heading ID for Section Outline and ScrollSpy
 */
export function generateHeadingId(text = '', index = 0) {
  const cleaned = text
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .toLowerCase();
  return cleaned || `heading-${index + 1}`;
}

/**
 * Fast search normalization
 */
export function normalizeSearchText(str = '') {
  if (!str) return '';
  return str.toLowerCase().trim();
}

/**
 * Monospace text scramble effect for technical HUD elements
 */
export function scrambleText(targetText, onUpdate, duration = 300) {
  const chars = '01_#/>-~%&*ABCDEF';
  const steps = 10;
  const intervalTime = duration / steps;
  let step = 0;

  const timer = setInterval(() => {
    step++;
    if (step >= steps) {
      clearInterval(timer);
      onUpdate(targetText);
      return;
    }

    const scrambled = targetText
      .split('')
      .map((char, index) => {
        if (char === ' ') return ' ';
        if (index < Math.floor((step / steps) * targetText.length)) {
          return targetText[index];
        }
        return chars[Math.floor(Math.random() * chars.length)];
      })
      .join('');

    onUpdate(scrambled);
  }, intervalTime);

  return () => clearInterval(timer);
}
