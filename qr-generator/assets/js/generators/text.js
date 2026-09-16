import { sanitizeText } from '../validation/sanitize.js';
import { LIMITS } from '../config.js';
import { validatePayloadLength } from '../core/qr-validator.js';

export function buildTextPayload(fields) {
  const text = sanitizeText(fields.text, LIMITS.maxTextLength).trim();
  if (!text) return { ok: false, error: 'Enter some text to encode.', empty: true };
  const len = validatePayloadLength(text);
  if (!len.ok) return { ok: false, error: len.error, empty: false };
  return { ok: true, payload: text, empty: false };
}
