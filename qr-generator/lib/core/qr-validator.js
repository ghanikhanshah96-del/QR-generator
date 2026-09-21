import { validateHttpUrl } from '../validation/url.js';
import { validateEmail } from '../validation/email.js';
import { validateWifi } from '../validation/wifi.js';
import { sanitizeText } from '../validation/sanitize.js';
import { LIMITS } from '../config.js';

export function validatePayloadLength(payload) {
  if (!payload) return { ok: false, error: 'Nothing to encode yet.' };
  if (payload.length > 2953) {
    return { ok: false, error: 'Payload is too large for a QR code. Shorten the content.' };
  }
  return { ok: true };
}

export function assertDesignReadable(design) {
  if (design.logoDataUrl && design.errorCorrectionLevel === 'L') {
    return {
      ok: true,
      warning: 'Logo detected — error correction was raised for reliability.',
    };
  }
  return { ok: true };
}

export { validateHttpUrl, validateEmail, validateWifi, sanitizeText, LIMITS };
