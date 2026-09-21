import { QR_TYPES } from './constants.js';
import { SITE } from './config.js';

export function absoluteUrl(path = '/') {
  const base = SITE.url.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

export function typePath(typeId) {
  return QR_TYPES[typeId]?.path || '/';
}

export { QR_TYPES, SITE };
