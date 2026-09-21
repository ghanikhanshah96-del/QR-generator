import { validateHttpUrl } from '../validation/url.js';

const IMAGE_HINT = /\.(png|jpe?g|gif|webp|svg|avif|bmp)(\?|#|$)/i;

/**
 * Image QR payload = public https URL (from upload host or pasted link).
 */
export function buildImagePayload(fields) {
  const raw = String(fields.imageUrl || '').trim();
  if (!raw) {
    return {
      ok: false,
      error: 'Upload an image or paste a public image URL.',
      empty: true,
    };
  }

  const result = validateHttpUrl(raw);
  if (!result.ok) return { ok: false, error: result.error, empty: false };

  const tip = fields.mediaHosted
    ? `Hosted via ${fields.mediaProvider || 'upload'} — scanning opens your image.`
    : IMAGE_HINT.test(result.url.pathname)
      ? 'Ready — scanning opens this image link.'
      : 'Tip: direct links ending in .png, .jpg, or .webp usually open most reliably.';

  return {
    ok: true,
    payload: result.value,
    empty: false,
    tip,
  };
}
