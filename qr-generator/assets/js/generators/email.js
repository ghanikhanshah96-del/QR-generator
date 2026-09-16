import { validateEmail } from '../validation/email.js';
import { sanitizeText } from '../validation/sanitize.js';

export function buildEmailPayload(fields) {
  const email = validateEmail(fields.email);
  if (!email.ok) {
    return { ok: false, error: email.error, empty: !String(fields.email || '').trim() };
  }
  const subject = sanitizeText(fields.subject || '', 200).trim();
  const body = sanitizeText(fields.body || '', 1000).trim();
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const qs = params.toString();
  const payload = `mailto:${email.value}${qs ? `?${qs}` : ''}`;
  return { ok: true, payload, empty: false };
}
