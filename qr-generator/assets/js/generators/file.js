import { validateHttpUrl } from '../validation/url.js';

const FILE_HINT = /\.(pdf|docx?|xlsx?|pptx?|txt|csv|rtf|odt|json|xml)(\?|#|$)/i;

/**
 * File QR payload = public https URL (upload host or pasted link).
 * Documents are too large to embed in a QR — encode a download/view link.
 */
export function buildFilePayload(fields) {
  const raw = String(fields.fileUrl || '').trim();
  if (!raw) {
    return {
      ok: false,
      error: 'Upload a file or paste a public file URL.',
      empty: true,
    };
  }

  const result = validateHttpUrl(raw);
  if (!result.ok) return { ok: false, error: result.error, empty: false };

  const tip = fields.mediaHosted
    ? `Hosted via ${fields.mediaProvider || 'upload'} — scanning opens your file link.`
    : FILE_HINT.test(result.url.pathname)
      ? 'Ready — scanning opens this file link.'
      : 'Tip: direct links ending in .pdf, .docx, or .txt usually open most reliably.';

  return {
    ok: true,
    payload: result.value,
    empty: false,
    tip,
  };
}
