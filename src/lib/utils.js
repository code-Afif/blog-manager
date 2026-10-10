/**
 * General purpose utilities for Marginalia Literary Journal
 */

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
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
 * Standard ~200 words per minute for contemplative prose.
 */
export function calculateReadTime(text = '', lang = 'en') {
  const words = countWords(text);
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Word count by stripping HTML and splitting on whitespace
 */
export function countWords(text = '') {
  if (!text) return 0;
  const stripped = text.replace(/<[^>]*>/g, ' ');
  return stripped.trim().split(/\s+/).filter(Boolean).length;
}

// Simple phonetics table for Devanagari transliteration
const DEVANAGARI_MAP = {
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri',
  'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'क': 'k', 'ख': 'kh', 'ग': 'g',
  'घ': 'gh', 'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ट': 't', 'ठ': 'th',
  'ड': 'd', 'ढ': 'dh', 'ण': 'n', 'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh',
  'न': 'n', 'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm', 'य': 'y',
  'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
  'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'े': 'e', 'ै': 'ai',
  'ो': 'o', 'ौ': 'au', 'ं': 'n', '्': '', '़': '',
};

// Simple phonetics table for Urdu / Arabic transliteration
const ARABIC_MAP = {
  'ا': 'a', 'آ': 'aa', 'ب': 'b', 'پ': 'p', 'ت': 't', 'ٹ': 't', 'ث': 's',
  'ج': 'j', 'چ': 'ch', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ڈ': 'd', 'ذ': 'z',
  'ر': 'r', 'ڑ': 'r', 'ز': 'z', 'ژ': 'zh', 'س': 's', 'ش': 'sh', 'ص': 's',
  'ض': 'z', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
  'ک': 'k', 'گ': 'g', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ں': 'n', 'و': 'o',
  'ہ': 'h', 'ھ': 'h', 'ء': '', 'ی': 'i', 'ے': 'e',
};

/**
 * Generate clean transliterated Latin URL slug
 */
export function generateSlug(title = '') {
  if (!title) return `essay-${Date.now().toString(36)}`;

  // Convert non-Latin scripts to Latin phonetics
  let transliterated = '';
  for (const char of title) {
    if (DEVANAGARI_MAP[char]) {
      transliterated += DEVANAGARI_MAP[char];
    } else if (ARABIC_MAP[char]) {
      transliterated += ARABIC_MAP[char];
    } else {
      transliterated += char;
    }
  }

  const clean = transliterated
    .toLowerCase()
    .trim()
    .replace(/<[^>]*>/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (clean) return clean;
  return `essay-${Date.now().toString(36)}`;
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
