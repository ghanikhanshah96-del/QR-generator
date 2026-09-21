import { sanitizeText } from './sanitize.js';

const DANGEROUS = /^(javascript|data|vbscript):/i;

export function normalizeUrl(raw) {
  const value = sanitizeText(String(raw ?? '').trim(), 2048);
  if (!value) return { ok: false, error: 'Enter a URL.' };

  let candidate = value;
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(candidate)) {
    candidate = `https://${candidate}`;
  }

  if (DANGEROUS.test(candidate)) {
    return { ok: false, error: 'This URL protocol is not allowed.' };
  }

  let url;
  try {
    url = new URL(candidate);
  } catch {
    return { ok: false, error: 'Enter a valid URL (e.g. https://example.com).' };
  }

  if (!['http:', 'https:', 'mailto:', 'tel:', 'sms:'].includes(url.protocol)) {
    return { ok: false, error: 'Only http, https, mailto, tel, and sms URLs are supported.' };
  }

  return { ok: true, value: url.href, url };
}

export function validateHttpUrl(raw) {
  const result = normalizeUrl(raw);
  if (!result.ok) return result;
  if (!['http:', 'https:'].includes(result.url.protocol)) {
    return { ok: false, error: 'Use an http or https web address.' };
  }
  return result;
}
