import { sanitizeText } from './sanitize.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(raw) {
  const value = sanitizeText(String(raw ?? '').trim(), 254);
  if (!value) return { ok: false, error: 'Enter an email address.' };
  if (!EMAIL_RE.test(value)) return { ok: false, error: 'Enter a valid email address.' };
  return { ok: true, value };
}
