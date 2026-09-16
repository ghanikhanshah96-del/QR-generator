import { validateHttpUrl } from '../validation/url.js';

/**
 * Accepts Google review / place links. Encodes the URL statically in the QR.
 */
export function buildGoogleReviewPayload(fields) {
  const raw = String(fields.reviewUrl || '').trim();
  if (!raw) {
    return { ok: false, error: 'Paste your Google review or Place URL.', empty: true };
  }

  const result = validateHttpUrl(raw);
  if (!result.ok) return { ok: false, error: result.error, empty: false };

  const host = result.url.hostname.replace(/^www\./, '');
  const allowed =
    host === 'g.page' ||
    host === 'maps.app.goo.gl' ||
    host === 'goo.gl' ||
    host.endsWith('google.com') ||
    host.endsWith('google.co.uk') ||
    host.includes('maps.google.');

  if (!allowed) {
    return {
      ok: false,
      error: 'Use a Google Maps, g.page, or Google Place review link.',
      empty: false,
    };
  }

  return { ok: true, payload: result.value, empty: false };
}
