import { LIMITS } from '../config.js';

const HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function isHexColor(value) {
  return typeof value === 'string' && HEX.test(value.trim());
}

export function normalizeHex(value, fallback = '#000000') {
  if (!isHexColor(value)) return fallback;
  let hex = value.trim();
  if (hex.length === 4) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex.toLowerCase();
}

export function contrastRatio(fg, bg) {
  const l1 = relativeLuminance(normalizeHex(fg));
  const l2 = relativeLuminance(normalizeHex(bg));
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
}

export function sanitizeText(value, max = LIMITS.maxTextLength) {
  return String(value ?? '')
    .replace(/\u0000/g, '')
    .slice(0, max);
}

export function stripControlChars(value) {
  return String(value ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
}
