/**
 * Client-side media hosting for Image/Video QR (QR.io-style).
 * Files are uploaded to a third-party host so the QR can encode a public https URL.
 * EverQR has no backend — we do not store media on EverQR servers.
 */

export const MEDIA_HOST = {
  name: 'tmpfiles.org',
  uploadUrl: 'https://tmpfiles.org/api/v1/upload',
  /** API allows 60–172800 seconds (up to 48 hours). */
  maxExpireSeconds: 172800,
  maxImageBytes: 15 * 1024 * 1024,
  maxVideoBytes: 80 * 1024 * 1024,
};

const IMAGE_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const VIDEO_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
  'video/mpeg',
  'video/ogg',
]);

export function validateMediaFile(file, kind = 'image') {
  if (!file) return { ok: false, error: 'No file selected.' };

  if (kind === 'image') {
    if (!IMAGE_TYPES.has(file.type) && !/\.(png|jpe?g|gif|webp|svg)$/i.test(file.name)) {
      return { ok: false, error: 'Use PNG, JPG, WebP, GIF, or SVG.' };
    }
    if (file.size > MEDIA_HOST.maxImageBytes) {
      return { ok: false, error: 'Image must be under 15 MB.' };
    }
  } else {
    if (!VIDEO_TYPES.has(file.type) && !/\.(mp4|webm|mov|avi|mkv|m4v)$/i.test(file.name)) {
      return { ok: false, error: 'Use MP4, WebM, or MOV video.' };
    }
    if (file.size > MEDIA_HOST.maxVideoBytes) {
      return { ok: false, error: 'Video must be under 80 MB.' };
    }
  }

  return { ok: true };
}

/** Convert tmpfiles page URL to a direct download URL for scanners. */
export function toDirectTmpfilesUrl(pageUrl) {
  try {
    const u = new URL(pageUrl);
    if (!u.hostname.includes('tmpfiles.org')) return pageUrl;
    // https://tmpfiles.org/{id}/{name} → https://tmpfiles.org/dl/{id}/{name}
    if (!u.pathname.startsWith('/dl/')) {
      u.pathname = `/dl${u.pathname}`;
    }
    return u.href;
  } catch {
    return String(pageUrl || '').replace('tmpfiles.org/', 'tmpfiles.org/dl/');
  }
}

/**
 * Upload a file and return a public https URL for QR encoding.
 * @param {File} file
 * @param {{ expireSeconds?: number }} [opts]
 */
export async function uploadMediaForQr(file, { expireSeconds = MEDIA_HOST.maxExpireSeconds } = {}) {
  const expire = Math.min(
    MEDIA_HOST.maxExpireSeconds,
    Math.max(60, Number(expireSeconds) || MEDIA_HOST.maxExpireSeconds)
  );

  const body = new FormData();
  body.append('file', file, file.name || 'media');
  body.append('expire', String(expire));

  let response;
  try {
    response = await fetch(MEDIA_HOST.uploadUrl, {
      method: 'POST',
      body,
    });
  } catch {
    throw new Error(
      'Upload failed (network). Check your connection, or paste a public URL instead.'
    );
  }

  if (!response.ok) {
    throw new Error(`Upload failed (${response.status}). Try a smaller file or paste a URL.`);
  }

  let json;
  try {
    json = await response.json();
  } catch {
    throw new Error('Upload returned an invalid response. Try again or paste a URL.');
  }

  if (json.status !== 'success' || !json.data?.url) {
    throw new Error('Upload did not return a public link. Try again or paste a URL.');
  }

  const pageUrl = json.data.url;
  const url = toDirectTmpfilesUrl(pageUrl);

  return {
    url,
    pageUrl,
    provider: MEDIA_HOST.name,
    expiresInSeconds: expire,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
  };
}

export function formatExpiry(seconds) {
  const h = Math.round(seconds / 3600);
  if (h >= 24) return `${Math.round(h / 24)} day(s)`;
  return `${h} hour(s)`;
}
