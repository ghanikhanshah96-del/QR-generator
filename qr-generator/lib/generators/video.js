import { validateHttpUrl } from '../validation/url.js';

/**
 * Normalize common video share links to a stable https URL.
 */
export function normalizeVideoUrl(href) {
  const url = new URL(href);
  const host = url.hostname.replace(/^www\./, '').toLowerCase();

  if (host === 'youtu.be') {
    const id = url.pathname.replace(/^\//, '').split('/')[0];
    if (id) return `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
  }
  if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
    if (url.pathname.startsWith('/shorts/')) {
      const id = url.pathname.split('/')[2];
      if (id) return `https://www.youtube.com/watch?v=${encodeURIComponent(id)}`;
    }
    const v = url.searchParams.get('v');
    if (v) return `https://www.youtube.com/watch?v=${encodeURIComponent(v)}`;
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const parts = url.pathname.split('/').filter(Boolean);
    const id = parts.find((p) => /^\d+$/.test(p));
    if (id) return `https://vimeo.com/${id}`;
  }

  return url.href;
}

/**
 * Video QR payload = public https URL (uploaded file host or YouTube/Vimeo/etc).
 */
export function buildVideoPayload(fields) {
  const raw = String(fields.videoUrl || '').trim();
  if (!raw) {
    return {
      ok: false,
      error: 'Upload a video or paste a public video URL.',
      empty: true,
    };
  }

  const result = validateHttpUrl(raw);
  if (!result.ok) return { ok: false, error: result.error, empty: false };

  let payload;
  try {
    payload = normalizeVideoUrl(result.value);
  } catch {
    payload = result.value;
  }

  const tip = fields.mediaHosted
    ? `Hosted via ${fields.mediaProvider || 'upload'} — scanning opens your video link.`
    : null;

  return { ok: true, payload, empty: false, tip };
}
