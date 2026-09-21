import { validateEmail } from '../validation/email.js';
import { sanitizeText } from '../validation/sanitize.js';

export function buildEmailPayload(fields) {
  const email = validateEmail(fields.email);
  if (!email.ok) {
    return { ok: false, error: email.error, empty: !String(fields.email || '').trim() };
  }
  const subject = sanitizeText(fields.subject || '', 200).trim();
  const body = sanitizeText(fields.body || '', 1000).trim();
  // Use encodeURIComponent (%20) — URLSearchParams uses "+" for spaces, which many
  // mail apps show as a literal plus instead of a space.
  const parts = [];
  if (subject) parts.push(`subject=${encodeURIComponent(subject)}`);
  if (body) parts.push(`body=${encodeURIComponent(body)}`);
  const qs = parts.join('&');
  const payload = `mailto:${email.value}${qs ? `?${qs}` : ''}`;
  return { ok: true, payload, empty: false };
}
