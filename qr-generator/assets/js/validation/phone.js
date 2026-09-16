import { sanitizeText } from './sanitize.js';

export function normalizePhone(raw) {
  const value = sanitizeText(String(raw ?? '').trim(), 32);
  if (!value) return { ok: false, error: 'Enter a phone number.' };
  const digits = value.replace(/[^\d+]/g, '');
  if (digits.replace(/\D/g, '').length < 7) {
    return { ok: false, error: 'Enter a valid phone number with country code if needed.' };
  }
  return { ok: true, value: digits };
}

export function combineCountryPhone(countryCode, phone) {
  const code = String(countryCode ?? '').replace(/[^\d]/g, '');
  const local = String(phone ?? '').replace(/[^\d]/g, '');
  if (!local) return { ok: false, error: 'Enter a phone number.' };
  if (local.length < 6) return { ok: false, error: 'Phone number looks too short.' };
  const e164 = code ? `+${code}${local}` : `+${local}`;
  return { ok: true, value: e164, digits: e164.replace(/\D/g, '') };
}
