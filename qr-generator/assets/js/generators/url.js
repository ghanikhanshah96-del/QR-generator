import { validateHttpUrl } from '../validation/url.js';

export function buildUrlPayload(fields) {
  const result = validateHttpUrl(fields.url);
  if (!result.ok) {
    return { ok: false, error: result.error, empty: !String(fields.url || '').trim() };
  }
  return { ok: true, payload: result.value, empty: false };
}
