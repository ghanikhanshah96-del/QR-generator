import { normalizePhone } from '../validation/phone.js';

export function buildPhonePayload(fields) {
  const phone = normalizePhone(fields.phone);
  if (!phone.ok) {
    return { ok: false, error: phone.error, empty: !String(fields.phone || '').trim() };
  }
  return { ok: true, payload: `tel:${phone.value}`, empty: false };
}
