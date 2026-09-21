import { SITE } from '../config.js';

export function ensureCanonical(path) {
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  const url = `${SITE.url.replace(/\/$/, '')}${path}`;
  link.href = url;
}
